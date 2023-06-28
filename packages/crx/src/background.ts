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

import { _crx } from './crx/crxPlaywright';
import './test/runTest';
import { Recorder } from '@playwright-core/server/recorder';
import { CrxRecorderApp } from '@playwright-core/server/crx/crxRecorderApp';
import type { CrxApplication } from '@playwright-core/client/crx';
import { setUnderTest } from 'playwright-core/lib/utils';
import type { BrowserContext } from '@playwright-core/client/browserContext';

type EnableRecorderOptions = Parameters<BrowserContext['_enableRecorder']>[0];

let crx!: CrxApplication;

async function openRecorder(options?: EnableRecorderOptions) {
  if (crx) return;

  crx = await _crx.start();
  const context = crx.context();
  Recorder.setAppFactory(async recorder => await CrxRecorderApp.open(recorder));

  await context._enableRecorder({ language: 'javascript', ...options });

  crx.attachAll();
}

// @ts-ignore
self.openRecorder = openRecorder;
// @ts-ignore
self.setUnderTest = setUnderTest;

chrome.action.onClicked.addListener(() => openRecorder());
