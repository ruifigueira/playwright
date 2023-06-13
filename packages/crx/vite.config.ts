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
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@playwright-core': path.resolve(__dirname, '../playwright-core/src'),
      '@playwright-test': path.resolve(__dirname, '../playwright-test/src'),
      'playwright-core/lib/server/deviceDescriptors': path.resolve(__dirname, '../playwright-core/src/server/deviceDescriptorsSource.json'),
      'playwright-core/lib/utilsBundle': path.resolve(__dirname, '../playwright-core/bundles/utils/src/utilsBundleImpl'),
      'playwright-core/lib/zipBundle': path.resolve(__dirname, '../playwright-core/bundles/zip/src/zipBundleImpl'),
      // more generic alias must be below specific ones
      'playwright-core/lib': path.resolve(__dirname, '../playwright-core/src'),
      'playwright-test/lib/common/expectBundle': path.resolve(__dirname, '../playwright-test/bundles/expect/src/expectBundleImpl'),
      'playwright-test/lib/utilsBundle': path.resolve(__dirname, '../playwright-test/bundles/utils/src/utilsBundleImpl'),
      // more generic alias must be below specific ones
      'playwright-test/lib': path.resolve(__dirname, '../playwright-test/src'),

      'child_process': path.resolve(__dirname, './src/shims/child_process'),
      'dns': path.resolve(__dirname, './src/shims/dns'),
      'module': path.resolve(__dirname, './src/shims/module'),
      'net': path.resolve(__dirname, './src/shims/net'),
      'readline': path.resolve(__dirname, './src/shims/readline'),
      'tls': path.resolve(__dirname, './src/shims/tls'),

      'graceful-fs': path.resolve(__dirname, './src/shims/fs'),
      'fs': path.resolve(__dirname, './src/shims/fs'),
      'path': 'path',

      // readable-stream
      'stream': path.resolve(__dirname, './node_modules/readable-stream'),

      // browserify
      'constants': 'constants-browserify',
      'crypto': 'crypto-browserify',
      'events': 'events',
      'http': 'stream-http',
      'https': 'https-browserify',
      'os': 'os-browserify/browser',
      'url': 'url',
      'util': 'util',
      'zlib': 'browserify-zlib',
    },
  },
  define: {
    // we need this one because of PLAYWRIGHT_CORE_PATH (it checks the actual version of playwright-core)
    'require.resolve': '((s) => s)',
    'process.platform': '"browser"',
    'process.versions.node': '"18.16"',
  },
  build: {
    outDir: path.resolve(__dirname, '../playwright-core/lib/webpack/crx'),
    // recorder assets are copied to devtools output dir, so this will prevent those assets from being deleted.
    emptyOutDir: false,
    // skip code obfuscation
    minify: false,
    // chunk limit is not an issue, this is a browser extension
    chunkSizeWarningLimit: 10240,
    rollupOptions: {
      input: {
        'background': path.resolve(__dirname, 'src/background.ts'),
        'devtools': path.resolve(__dirname, 'devtools.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    commonjsOptions: {
      include: [
        path.resolve(__dirname, '../playwright-core/src/server/deviceDescriptors.js'),
        path.resolve(__dirname, '../playwright-core/src/third_party/**/*.js'),
        path.resolve(__dirname, '../playwright-core/bundles/utils/src/third_party/**/*.js'),
        /node_modules/,
      ],
    }
  },
});
