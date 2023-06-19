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
import { BrowserContext } from './browserContext';

export class Crx extends ChannelOwner<channels.CrxChannel> implements api.Crx {
  private _isClosed = false;
  private _context?: BrowserContext;

  static from(crx: channels.CrxChannel): Crx {
    return (crx as any)._object;
  }

  constructor(parent: ChannelOwner, type: string, guid: string, initializer: channels.CrxInitializer) {
    super(parent, type, guid, initializer);
  }

  async connect(options?: { timeout?: number | undefined; } | undefined): Promise<BrowserContext> {
    if (this._context) return this._context;
    const params = options ?? {};
    const browserContext = BrowserContext.from((await this._channel.connect(params)).browserContext);
    this._context = browserContext;
    return browserContext;
  }

  async close() {
    if (this._isClosed)
      return;
    await this._channel.close().catch(() => {});
  }
}
