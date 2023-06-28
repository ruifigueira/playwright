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

import type { EventData, CallLog, Source } from '@recorder/recorderTypes';
import type { RecorderMessage } from '@playwright-core/server/crx/crxRecorderApp';

let setPaused: (paused: boolean) => void;
let setMode: (mode: 'none' | 'recording' | 'inspecting') => void;
let setSources: (sources: Source[]) => void;
let updateCallLogs: (callLogs: CallLog[]) => void;
let setSelector: (selector: string, focus?: boolean) => void;
let setFileIfNeeded: (file: string) => void;

const tabId = chrome.devtools.inspectedWindow.tabId;
let _port: chrome.runtime.Port | undefined;

let attachedCallback!: () => void;
const attachedPromise = new Promise<void>(resolve => {
  attachedCallback = resolve;
});

async function _onDispatch(data: EventData) {
  if (!_port) {
    // ensures that background is notified when this devtools is closed
    // https://developer.chrome.com/docs/extensions/mv3/devtools/#detecting-open-close
    _port = chrome.runtime.connect({ name: `playwright-devtools-page-${tabId}` });
    _port.onMessage.addListener(async (msg: { event: 'attached' } | RecorderMessage) => {
      if ('event' in msg && msg.event === 'attached') {
        attachedCallback();
        return;
      }

      if (!('type' in msg) || msg.type !== 'recorder') return;

      await attachedPromise;

      switch (msg.method) {
        case 'setPaused': setPaused(msg.paused); break;
        case 'setMode': setMode(msg.mode); break;
        case 'setSources': setSources(msg.sources); break;
        case 'updateCallLogs': updateCallLogs(msg.callLogs); break;
        case 'setSelector': setSelector(msg.selector, msg.focus); break;
        case 'setFileIfNeeded': setFileIfNeeded(msg.file); break;
      }
    });
  }

  await attachedPromise;
  _port.postMessage({ type: 'recorderEvent', ...data });
}

chrome.devtools.panels.create('Playwright Recorder', 'recorder/icon-16x16.png', 'recorder/index.html', panel => {
  panel.onShown.addListener(async window => {

    setPaused = paused => window.playwrightSetPaused(paused);
    setMode = mode => window.playwrightSetMode(mode);
    setSources = sources => window.playwrightSetSources(sources);
    updateCallLogs = callLogs => window.playwrightUpdateLogs(callLogs);
    setSelector = selector => window.playwrightSetSelector(selector);
    setFileIfNeeded = file => window.playwrightSetFileIfNeeded(file);

    window.dispatch = _onDispatch;
  });
});
