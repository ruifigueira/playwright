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

import type { Worker } from 'playwright-core';
import { getRequiredFixtureNames } from './fixtureRunner';
import type { TestInfoImpl } from './testInfo';

const toProcessParamFixtureKeys = [
  'page',
  'server',
];

const asIsSupportedParamFixtureKeys = [
  'browserName',
  'headless',
  'channel',
  'screenshot',
  'trace',
  'video',
  'browserName',
  'browserVersion',
  'browserMajorVersion',
  'isAndroid',
  'isElectron',
  'isWebView2',
  'platform',
  'isWindows',
  'isMac',
  'isLinux',
];

const supportedParamFixtureKeys = [
  ...toProcessParamFixtureKeys,
  ...asIsSupportedParamFixtureKeys,
];

export default class CrxTestRunner {
  private _testInfo: TestInfoImpl;

  constructor(testInfo: TestInfoImpl) {
    this._testInfo = testInfo;
  }

  isCrxTest() {
    return process.env.PWPAGE_IMPL === 'crx';
  }

  isToSkip() {
    const names = getRequiredFixtureNames(this._testInfo.fn);
    return !names.every(name => supportedParamFixtureKeys.includes(name));
  }

  async run(testFunctionParams: any) {
    const { page, server: serverObj } = testFunctionParams as any;
    const worker = page?.extensionServiceWorker as Worker;

    if (!worker) throw new Error(`could not find extensionServiceWorker0`);

    let server;
    if (serverObj) {
      const { PORT, PREFIX, CROSS_PROCESS_PREFIX, EMPTY_PAGE } = serverObj;
      server = { PORT, PREFIX, CROSS_PROCESS_PREFIX, EMPTY_PAGE };
    }

    const params: any = server ? { server } : {};

    if (testFunctionParams) {
      for (const key of asIsSupportedParamFixtureKeys) {
        if (key in testFunctionParams)
          params[key] = testFunctionParams[key];
      }
    }

    try {
      const fn = this._testInfo.fn;
      const fnBody = fn.toString()
          .replaceAll(/\w+\.expect/g, 'expect')
          .replaceAll(/\_\w+Test\.test/g, 'test');
      await worker.evaluate(new Function(`return async (fixtures) => {
        const { test, expect } = self;
        await runTest(fixtures, ${fnBody});
      }`)(), {
        server,
        ...params,
      });
    } catch (e) {
      if (e.message) {
        const [, notDefinedVar] = /ReferenceError: (\S+) is not defined/.exec(e.message) ?? [];
        if (!notDefinedVar) throw e;
        this._testInfo.skip(true, `Skipping test because it contains a variable defined outside the scope: ${notDefinedVar}`);
      }
    }
  }
}
