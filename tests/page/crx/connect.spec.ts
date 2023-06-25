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
import { crxTest as test, expect } from '../../crx/crxTest';

test('should work @smoke', async ({ page }) => {
  const context = page.context();
  expect(context.pages()).toHaveLength(1);
  const newPage = await context.newPage();
  expect(context.pages()).toHaveLength(2);
  let closed = false;
  newPage.once('close', () => {
    closed = true;
  });
  await newPage.close();
  expect(context.pages()).toHaveLength(1);
  expect(closed).toBeTruthy();
});
