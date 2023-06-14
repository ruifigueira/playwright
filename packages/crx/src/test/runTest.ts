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
import { rootTestType } from '@playwright-test/common/testType';
import { setCurrentTestInfo, setCurrentlyLoadingFileSuite } from '@playwright-test/common/globals';
import { Suite } from '@playwright-test/common/test';
import { TestInfoImpl } from '@playwright-test/worker/testInfo';
import type { FullConfigInternal, FullProjectInternal } from '@playwright-test/common/config';
import type { SerializedConfig } from '@playwright-test/common/ipc';

const test = rootTestType.test;

// @ts-ignore
self.runTest = runTest; self.expect = expect; self.test = test;

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

  const suite = new Suite('test', 'file');


  try {
    setCurrentlyLoadingFileSuite(suite);
    test('test', fn);
    setCurrentlyLoadingFileSuite(undefined);

    const [testCase] = suite.tests;
    const noop = () => {};
    const testInfo = new TestInfoImpl(
        { config: {} } as unknown as FullConfigInternal,
        { project: { snapshotDir: '.', testDir: '.', outputDir: '.' } } as FullProjectInternal,
        { workerIndex: 0, parallelIndex: 0, projectId: 'crx', repeatEachIndex: 0, config: { } as SerializedConfig },
        testCase,
        0,
        noop,
        noop,
        noop,
    );
    setCurrentTestInfo(testInfo);

    const page = await getOrCreatePage(tab.id!);

    const fixtures = { ...serverFixtures, tab, page };
    await fn(fixtures);

    await page.close();
    await chrome.tabs.remove(tab.id);

  } finally {
    setCurrentTestInfo(null);

    // just to ensure we don't leak
    setCurrentlyLoadingFileSuite(undefined);
  }
}
