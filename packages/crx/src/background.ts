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

import './shims/global';

import type { Port } from './crx/crxPlaywright';
import playwright, { getOrCreatePage, getPage } from './crx/crxPlaywright';
import { setUnderTest } from '@playwright-core/utils';
import './test/runTest';
// import { expect } from '@playwright-test/matchers/expect';

// chrome.action.onClicked.addListener(async () => {
//   runTest({ server: {} } as any, async ({ page }) => {
//     await page.goto('https://demo.playwright.dev/todomvc/');
//     await page.getByPlaceholder('What needs to be done?').click();
//     await page.getByPlaceholder('What needs to be done?').fill('Hello World');
//     await page.getByPlaceholder('What needs to be done?').press('Enter');
//     await page.getByRole('link', { name: 'All' }).click();
//     await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();
//     await page.getByTestId('todo-title').click();
//     await expect(page.getByPlaceholder('What needs to be done?')).toContainText('World');
//   });
// });

async function _onAttach(tabId: number, port: Port, options?: { language?: string, mode?: 'recording' | 'inspecting', underTest?: boolean }) {
  options = { language: 'javascript', mode: 'recording', ...options };
  if (options.underTest) setUnderTest();

  const page = await getOrCreatePage(tabId, port);
  // underTest is set on unit tests, so they will eventually enable recorder
  if (!options.underTest)
    await page.context()._enableRecorder({ language: 'javascript', ...options });

  // console.log runs in the page, not here
  // eslint-disable-next-line no-console
  await page.evaluate(() => console.log('Recording...'));

  port.postMessage({ event: 'attached' });
}

async function _onDetach(tabId: number) {
  const page = await getPage(tabId);
  await page?.close();
}

chrome.action.onClicked.addListener(async tab => {
  if (!tab.id) return;

  const window = await chrome.windows.create({ type: 'popup' });
  const recorderTab = await chrome.tabs.create({
    windowId: window.id,
    url: 'recorder/index.html',
    active: true
  });

  setTimeout(() => {
    const port = chrome.tabs.connect(recorderTab.id!);
    _onAttach(tab.id!, port, { mode: 'recording' });
  }, 1000);

  chrome.tabs.onRemoved.addListener(tabId => {
    if (tabId === recorderTab.id) playwright._crx.close();
  });
});

const portRegex = /playwright-devtools-page-(\d+)/;

function onConnect(port: Port) {
  const [, tabIdString] = port.name.match(portRegex) ?? [];
  if (!tabIdString) return;

  const tabId = parseInt(tabIdString, 10);

  // https://stackoverflow.com/a/46628145
  port.onMessage.addListener(({ type }) => {
    switch (type) {
      case 'detach': _onDetach(tabId); break;
    }
  });

  port.onDisconnect.addListener(async () => {
    await _onDetach(tabId);
  });

  _onAttach(tabId, port);
}

// https://developer.chrome.com/docs/extensions/mv3/devtools/#detecting-open-close
chrome.runtime.onConnect.addListener(onConnect);
