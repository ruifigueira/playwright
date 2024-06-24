/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '@web/common.css';
import { applyTheme, currentTheme, toggleTheme } from '@web/theme';
import '@web/third_party/vscode/codicon.css';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { EmbeddedWorkbenchLoader } from './ui/embeddedWorkbenchLoader';
import { setPopoutFunction } from './ui/utils';

(async () => {
  applyTheme();

  window.addEventListener('message', ({ data }) => {
    if (!data.theme)
      return;
    if (currentTheme() !== data.theme)
      toggleTheme();
  });

  setPopoutFunction((url: string, target?: string) => {
    if (!url)
      return;
    window.parent.postMessage({ command: 'openExternal', url, target }, '*');
  });

  ReactDOM.render(<EmbeddedWorkbenchLoader />, document.querySelector('#root'));
})();
