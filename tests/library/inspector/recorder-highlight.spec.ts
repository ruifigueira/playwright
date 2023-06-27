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

import { test as it, expect } from './inspectorTest';

it('should uninstall highlight when closing recorder', async ({ page, openRecorder, closeRecorder }) => {
  const recorder = await openRecorder();
  await recorder.setContentAndWait(`<span>dummy</span>`);

  // Force highlight.
  await recorder.hoverOverElement('span');
  await expect(page.locator('x-pw-glass')).toHaveCount(1);

  await closeRecorder();
  await expect(page.locator('x-pw-glass')).toHaveCount(0);
});

it('should uninstall highlight when stop recording', async ({ page, openRecorder }) => {
  const recorder = await openRecorder();
  await recorder.setContentAndWait(`<span>dummy</span>`);

  // Force highlight.
  await recorder.hoverOverElement('span');
  await expect(page.locator('x-pw-glass')).toHaveCount(1);

  await recorder.setRecording(false);
  await expect(page.locator('x-pw-glass')).toHaveCount(0);
});

it('should reinstall highlight when start recording', async ({ page, openRecorder }) => {
  const recorder = await openRecorder();
  await recorder.setContentAndWait(`<span>dummy</span>`);

  await recorder.setRecording(false);
  await expect(page.locator('x-pw-glass')).toHaveCount(0);

  await recorder.setRecording(true);
  await expect(page.locator('x-pw-glass')).toHaveCount(0);
});
