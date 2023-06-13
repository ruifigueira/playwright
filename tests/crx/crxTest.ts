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

import * as path from 'path';
import { contextTest } from '../config/browserTest';
import type { PageTestFixtures } from '../page/pageTestApi';
import type { Worker } from 'playwright-core';
export { expect } from '@playwright/test';

export type CrxTestFixtures = {
  extensionServiceWorker: Worker;
};

export const crxTest = contextTest.extend<PageTestFixtures & CrxTestFixtures>({

  context: async ({ launchPersistent, headless }, run) => {
    const pathToExtension = path.join(__dirname, '../../packages/playwright-core/lib/webpack/crx');
    const { context } = await launchPersistent({
      headless,
      args: [
        ...(headless ? [`--headless=new`] : []),
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ]
    });

    await run(context);

    if (context)
      await context.close();
  },

  extensionServiceWorker: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');

    // wait for initialization
    await worker.evaluate(() => new Promise<void>((resolve, reject) => {
      if (serviceWorker.state !== 'activated') {
        serviceWorker.addEventListener('statechange', () => {
          if (serviceWorker.state === 'activated') resolve();
        });
        serviceWorker.addEventListener('error', reject);
      } else {
        resolve();
      }
    }));

    await use(worker);
  },

  // we pass extensionServiceWorker to force its instantiation
  page: async ({ context, extensionServiceWorker }, run) => {
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    // just to carry extensionServiceWorker for the test
    page['extensionServiceWorker'] = extensionServiceWorker;
    await run(page);
  },
});
