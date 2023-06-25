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

import path from 'path';
import recorderConfig from '../recorder/vite.config';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  ...recorderConfig,
  base: './',
  root: '../recorder',
  build: {
    ...(recorderConfig as UserConfig).build,
    outDir: path.resolve(__dirname, '../playwright-core/lib/webpack/crx/recorder'),
  },
  optimizeDeps: {
    include: [
      path.resolve(__dirname, './src/contentscript.ts'),
    ],
  },
});