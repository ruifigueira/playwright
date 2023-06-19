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
import { Recorder } from '@playwright-core/server/recorder';
import { CrxRecorderApp } from './crxRecorder';
import type { Page } from '@playwright-core/client/page';
export type { Page } from '@playwright-core/client/page';

export type Port = chrome.runtime.Port;

const playwright = createInProcessPlaywright();
export const { _crx } = playwright;

const _pages: Map<number, Promise<Page>> = new Map();

export async function getPage(tabId: number) {
  const pagePromise = _pages.get(tabId);
  return pagePromise ? await pagePromise : undefined;
}

export async function getOrCreatePage(tabId: number, port?: Port) {
  if (_pages.has(tabId)) return _pages.get(tabId)!;

  const pagePromise = createPage(tabId, port);
  _pages.set(tabId, pagePromise);

  return await pagePromise;
}

async function createPage(tabId: number, port?: Port) {
  let recorderApp: CrxRecorderApp | undefined;

  if (port) {
    Recorder.setAppFactory(async recorder => {
      recorderApp = new CrxRecorderApp(port, recorder);
      return recorderApp;
    });
  }

  const context = await playwright._crx.connect();
  const page = context.pages()[0] ?? await context.newPage();

  return page;
}

export default playwright;
