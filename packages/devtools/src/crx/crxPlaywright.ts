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
import { createInProcessPlaywright } from '@playwright-core/inProcessFactory';
import type { Playwright } from '@playwright-core/server';
import { CrxTransport } from './crxTransport';
import type { Progress } from '@playwright-core/server/progress';
import type { LaunchOptions } from '@playwright-core/client/types';
import { Recorder } from '@playwright-core/server/recorder';
import { CrxRecorderApp } from './crxRecorder';
import type { Page } from '@playwright-core/client/page';
export type { Page } from '@playwright-core/client/page';

const playwright = createInProcessPlaywright();
const serverPlaywright = (playwright as any)._toImpl()._dispatchers.get('Playwright')._object as Playwright;

const _pages: Map<number, Page> = new Map();

export function getPage(tabId: number) {
  return _pages.get(tabId);
}

export async function getOrCreatePage(tabId: number, options?: { enableRecorder?: boolean }) {
  if (_pages.has(tabId)) return _pages.get(tabId)!;

  let transport: CrxTransport | undefined;
  let recorderApp: CrxRecorderApp | undefined;

  if (options?.enableRecorder)
    recorderApp = new CrxRecorderApp(tabId);

  // chrome.debugger requires a debuggee, identified by its tabId.
  // We have to do override _launchProcess to pass it the tabId
  // @ts-ignore
  serverPlaywright.chromium._launchProcess = async function(progress: Progress, options: LaunchOptions) {
    transport = await CrxTransport.connect(progress, tabId);
    const doClose = async () => {
      try {
        // we need to close recorder app before connection is closed
        await recorderApp?.close();
      } catch (e) {
        // do nothing...
      }

      // this will eventually trigger a ConnectionEvents.Disconnected event
      transport!.close();
    };
    return { browserProcess: { close: doClose, kill: doClose }, artifactsDir: '', userDataDir: '', transport };
  };

  if (options?.enableRecorder)
    Recorder.setAppFactory(async () => recorderApp!);

  const browser = await playwright.chromium.launch({ tracesDir: 'traces' });
  const context = await browser._newContextForReuse();
  if (options?.enableRecorder)
    context._enableRecorder({ language: 'javascript' });

  const page = await context.newPage();

  // closing the page will close the browser
  page.close = async () => {
    // already called, return to avoid infinite recursion
    if (!_pages.has(tabId)) return;
    _pages.delete(tabId);

    await page.close();
    await browser.close();
    await transport?.closeAndWait();
  };

  chrome.tabs.onRemoved.addListener(() => page.close());

  _pages.set(tabId, page);
  return page;
}

export default playwright;
