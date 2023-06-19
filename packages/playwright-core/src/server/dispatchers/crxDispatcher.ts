/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
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

import type * as channels from '@protocol/channels';
import { Crx } from '../crx/crx';
import { BrowserContextDispatcher } from './browserContextDispatcher';
import type { RootDispatcher } from './dispatcher';
import { Dispatcher } from './dispatcher';

export class CrxDispatcher extends Dispatcher<Crx, channels.CrxChannel, RootDispatcher> implements channels.CrxChannel {
  _type_EventTarget = true;
  _type_Crx = true;

  constructor(scope: RootDispatcher, crx: Crx) {
    super(scope, crx, 'Crx', {});
    this.addObjectListener(Crx.Events.Close, () => {
      this._dispatchEvent('close');
      this._dispose();
    });
  }

  async connect(params: channels.CrxConnectParams): Promise<channels.CrxConnectResult> {
    const browserContext = await this._object.connect(params);
    return {
      browserContext: new BrowserContextDispatcher(this.parentScope(), browserContext)
    };
  }

  async close(): Promise<void> {
    await this._object.close();
  }
}
