/*
  Copyright (c) Microsoft Corporation.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import * as React from 'react';
import type { ContextEntry } from '@isomorphic/trace/entries';
import { MultiTraceModel } from './modelUtil';
import './embeddedWorkbenchLoader.css';
import { Workbench } from './workbench';
import { baseUrl } from './utils';

export const EmbeddedWorkbenchLoader: React.FunctionComponent = () => {
  const [traceURLs, setTraceURLs] = React.useState<string[]>([]);
  const [model, setModel] = React.useState<MultiTraceModel>(emptyModel);
  const [progress, setProgress] = React.useState<{ done: number, total: number }>({ done: 0, total: 0 });
  const [processingErrorMessage, setProcessingErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const base = baseUrl();
    const params = new URL(base).searchParams;
    const newTraceURLs = params.getAll('trace');
    setTraceURLs(newTraceURLs);

    window.addEventListener('message', async ({ data: { method, params } }) => {
      if (method !== 'loadTraceRequested')
        return;
      setTraceURLs(params.traceUrl ? [params.traceUrl] : []);
      setProcessingErrorMessage(null);
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      if (traceURLs.length) {
        const contextEntries: ContextEntry[] = [];
        for (let i = 0; i < traceURLs.length; i++) {
          const url = traceURLs[i];
          const params = new URLSearchParams();
          params.set('trace', url);
          const response = await fetch(`contexts?${params.toString()}`);
          if (!response.ok) {
            setTraceURLs([]);
            setProcessingErrorMessage((await response.json()).error);
            return;
          }
          contextEntries.push(...(await response.json()));
        }
        const model = new MultiTraceModel(contextEntries);
        setProgress({ done: 0, total: 0 });
        setModel(model);
      } else {
        setModel(emptyModel);
      }
    })();
  }, [traceURLs]);

  React.useEffect(() => {
    if (processingErrorMessage)
      window.postMessage({ method: 'showErrorMessage', params: { message: processingErrorMessage } }, '*');
  }, [processingErrorMessage]);

  return <div className='vbox workbench-loader'>
    <div className='progress'>
      <div className='inner-progress' style={{ width: progress.total ? (100 * progress.done / progress.total) + '%' : 0 }}></div>
    </div>
    <Workbench model={model} />
    {!traceURLs.length && <div className='empty-state'>
      <div className='title'>Select test to see the trace</div>
    </div>}
  </div>;
};

export const emptyModel = new MultiTraceModel([]);
