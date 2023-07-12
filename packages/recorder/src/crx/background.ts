/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { CrxApplication } from '@playwright/experimental-crx';
import { _setUnderTest, _crx } from '@playwright/experimental-crx';

// used by crxInspectorTest
Object.assign(self, { _setUnderTest, _crx });

// we must lazy initialize it
let _crxPromise: Promise<CrxApplication> | undefined;

const attachedTabIds = new Set<number>();

async function changeAction(tabId: number, mode: 'none' | 'recording' | 'inspecting' | 'detached') {
  // detached basically implies recorder windows was closed
  if (mode === 'detached' || mode === 'none') {
    await Promise.all([
      chrome.action.setTitle({ title: mode === 'none' ? 'Stopped' : 'Record', tabId }),
      chrome.action.setBadgeText({ text: '', tabId }),
    ]).catch(() => {});
    return;
  }

  const { text, title, color, bgColor } = mode === 'recording' ?
    { text: 'REC', title: 'Recording', color: 'white', bgColor: 'darkred' } :
    { text: 'INS', title: 'Inspecting', color: 'white', bgColor: 'dodgerblue' };

  await Promise.all([
    chrome.action.setTitle({ title, tabId }),
    chrome.action.setBadgeText({ text, tabId }),
    chrome.action.setBadgeTextColor({ color, tabId }),
    chrome.action.setBadgeBackgroundColor({ color: bgColor, tabId }),
  ]).catch(() => {});
}

async function getCrx() {
  if (!_crxPromise) {
    _crxPromise = _crx.start().then(crx => {
      crx.recorder.addListener('hide', async () => {
        await crx.detachAll();
      });
      crx.recorder.addListener('modechanged', async ({ mode }) => {
        await Promise.all([...attachedTabIds].map(tabId => changeAction(tabId, mode)));
      });
      crx.addListener('attached', async ({ tabId }) => {
        attachedTabIds.add(tabId);
        await changeAction(tabId, crx.recorder.mode);
      });
      crx.addListener('detached', async tabId => {
        attachedTabIds.delete(tabId);
        await changeAction(tabId, 'detached');
      });
      return crx;
    });
  }

  return await _crxPromise;
}

async function attach(tab: chrome.tabs.Tab) {
  if (!tab.id || attachedTabIds.has(tab.id)) return;
  const tabId = tab.id;

  // ensure one attachment at a time
  chrome.action.disable();

  try {
    const crx = await getCrx();
    if (crx.recorder.isHidden())
      await crx.recorder.show({ mode: 'recording' });

    await crx.attach(tabId);
  } catch (e) {
    // nothing much to do...
  } finally {
    chrome.action.enable();
  }
}

chrome.action.onClicked.addListener(attach);

chrome.contextMenus.create({
  id: 'pw-recorder',
  title: 'Attach to Playwright Recorder',
  contexts: ['all'],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab) await attach(tab);
});

