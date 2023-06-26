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
import { PageDispatcher } from './pageDispatcher';
import type { Crx, CrxApplication } from '../crx/crx';
import type { RootDispatcher } from './dispatcher';
import { Dispatcher } from './dispatcher';
import { BrowserContextDispatcher } from './browserContextDispatcher';

export class CrxDispatcher extends Dispatcher<Crx, channels.CrxChannel, RootDispatcher> implements channels.CrxChannel {
  _type_Crx = true;

  constructor(scope: RootDispatcher, crx: Crx) {
    super(scope, crx, 'Crx', { });
  }

  async start(): Promise<channels.CrxStartResult> {
    return { crxApplication: new CrxApplicationDispatcher(this, await this._object.start()) };
  }
}


export class CrxApplicationDispatcher extends Dispatcher<CrxApplication, channels.CrxApplicationChannel, CrxDispatcher> implements channels.CrxApplicationChannel {
  _type_CrxApplication = true;

  private _context: BrowserContextDispatcher;

  constructor(scope: CrxDispatcher, crxApplication: CrxApplication) {
    const context = new BrowserContextDispatcher(scope, crxApplication._context());
    super(scope, crxApplication, 'CrxApplication', { context });
    this._context = context;
  }

  async attach(params: channels.CrxApplicationAttachParams): Promise<channels.CrxApplicationAttachResult> {
    return { page: PageDispatcher.from(this._context, await this._object.attach(params.tabId)) };
  }

  async attachAll(params: channels.CrxApplicationAttachAllParams): Promise<channels.CrxApplicationAttachAllResult> {
    return { pages: (await this._object.attachAll(params)).map(page => PageDispatcher.from(this._context, page)) };
  }

  async detach(params: channels.CrxApplicationDetachParams): Promise<void> {
    await this._object.detach(params.tabId);
  }

  async newPage(params: channels.CrxApplicationNewPageParams): Promise<channels.CrxApplicationNewPageResult> {
    return { page: PageDispatcher.from(this._context, await this._object.newPage(params)) };
  }

  async close(): Promise<void> {
    await this._object.close();
    this._dispose();
  }
}
