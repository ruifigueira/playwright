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

// import { loadTestFile } from '@playwright-test/common/testLoader';
// import type { TestError } from '@playwright/test/reporter';

import type { PageTestFixtures } from 'tests/page/pageTestApi';
import { getOrCreatePage } from '../crx/crxPlaywright';
import { expect } from '@playwright-test/matchers/expect';

type LightServerFixtures = {
  server: {
    readonly PORT: number;
    readonly PREFIX: string;
    readonly CROSS_PROCESS_PREFIX: string;
    readonly EMPTY_PAGE: string;
  },
};

type CrxFixtures = PageTestFixtures & LightServerFixtures;

export async function runTest(serverFixtures: LightServerFixtures, fn: (fixtures: CrxFixtures) => Promise<void>) {
  const tab = await chrome.tabs.create({
    active: true,
    url: 'about:blank',
  });

  if (!tab.id) throw new Error(`Failed to create a new tab`);
  const page = await getOrCreatePage(tab.id!);

  const fixtures = { ...serverFixtures, tab, page };
  await fn(fixtures);

  await page.close();
  await chrome.tabs.remove(tab.id);
}
