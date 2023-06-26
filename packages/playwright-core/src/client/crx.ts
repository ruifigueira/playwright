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

import { ChannelOwner } from './channelOwner';
import type * as api from '../../types/types';
import type * as channels from '@protocol/channels';
import { Page } from './page';
import { BrowserContext } from './browserContext';

type NewPageOptions = channels.CrxApplicationNewPageOptions;
type AttachAllOptions = channels.CrxApplicationAttachAllOptions;

export class Crx extends ChannelOwner<channels.CrxChannel> implements api.Crx {

  private _crxApplication?: CrxApplication;

  static from(crx: channels.CrxChannel): Crx {
    return (crx as any)._object;
  }

  async start() {
    if (!this._crxApplication)
      this._crxApplication = CrxApplication.from((await this._channel.start()).crxApplication);

    return this._crxApplication;
  }
}

export class CrxApplication extends ChannelOwner<channels.CrxApplicationChannel> implements api.CrxApplication {
  private _context: BrowserContext;

  static from(crxApplication: channels.CrxApplicationChannel): CrxApplication {
    return (crxApplication as any)._object;
  }

  constructor(parent: ChannelOwner, type: string, guid: string, initializer: channels.CrxApplicationInitializer) {
    super(parent, type, guid, initializer);
    this._context = BrowserContext.from(initializer.context);
  }

  async attach(tabId: number) {
    return Page.from((await this._channel.attach({ tabId })).page);
  }

  async attachAll(query?: AttachAllOptions) {
    return (await this._channel.attachAll(query ?? {})).pages.map(p => Page.from(p));
  }

  async detach(tabId: number): Promise<void> {
    await this._channel.detach({ tabId });
  }

  async newPage(options?: NewPageOptions) {
    return Page.from((await this._channel.newPage(options ?? {})).page);
  }

  pages(): api.Page[] {
    return this._context.pages();
  }

  async close() {
    await this._channel.close().catch(() => {});
  }
}
