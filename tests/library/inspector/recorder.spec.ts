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

import type { Source } from '@recorder/recorderTypes';
import type { Page } from 'packages/playwright-test';
import { test, expect } from './inspectorTest';

async function getSource(recorderPage: Page) {
  return await recorderPage.evaluate((params: { languageId; }) => {
    return (window.playwrightSourcesEchoForTest as Source[]).find((s: Source) => s.id === params.languageId);
  }, { languageId: 'javascript' });
}

test(`should record a navigation after an action`, async ({ openRecorder, server }) => {
  const { recorderPage, page } = await openRecorder();

  await page.goto(server.PREFIX + '/input/textarea.html');
  await page.fill('textarea', 'hello world');
  await page.goto(server.PREFIX + '/input/button.html');
  await page.click('button');

  // stop recording
  await recorderPage.locator('[title="Record"]').click();

  await expect.poll(async () => (await getSource(recorderPage)).actions).toStrictEqual([
    `  const page = await context.newPage();`,
    `  await page.goto('${server.PREFIX}/input/textarea.html');`,
    `  await page.locator('textarea').fill('hello world');`,
    `  await page.goto('${server.PREFIX}/input/button.html');`,
    `  await page.getByRole('button', { name: 'Click target' }).click();`,
  ]);
});


