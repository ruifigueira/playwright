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

import type * as channels from '@protocol/channels';
import { RecentLogsCollector } from '../../common/debugLogger';
import { TimeoutSettings } from '../../common/timeoutSettings';
import { Browser, type BrowserOptions, type BrowserProcess } from '../browser';
import { BrowserContext } from '../browserContext';
import { validateBrowserContextOptions } from '../browserContext';
import { CRBrowser } from '../chromium/crBrowser';
import { helper } from '../helper';
import { SdkObject, serverSideCallMetadata } from '../instrumentation';
import type { Playwright } from '../playwright';
import { ProgressController } from '../progress';
import { CrxTransport } from './crxTransport';

export class Crx extends SdkObject {
  static Events = {
    Close: 'close',
  };

  private _browserContext?: BrowserContext;

  constructor(playwright: Playwright) {
    super(playwright, 'crx');
  }

  async close() {
    if (!this._browserContext) return;
    const progressController = new ProgressController(serverSideCallMetadata(), this);
    const closed = progressController.run(progress => helper.waitForEvent(progress, this, Crx.Events.Close).promise);
    await this._browserContext.close(serverSideCallMetadata());
    await closed;
  }

  async connect(options: channels.CrxConnectOptions): Promise<BrowserContext> {
    const controller = new ProgressController(serverSideCallMetadata(), this);
    controller.setLogName('browser');
    return controller.run(async progress => {
      const transport = await CrxTransport.connect(progress);
      const browserLogsCollector = new RecentLogsCollector();
      const doCloseTransport = async () => await transport.closeAndWait();
      const browserProcess: BrowserProcess = {
        onclose: undefined,
        process: undefined,
        close: () => Promise.resolve(),
        kill: doCloseTransport,
      };
      const contextOptions: channels.BrowserNewContextParams = {
        ...options,
        noDefaultViewport: true,
      };
      const browserOptions: BrowserOptions = {
        name: 'crx',
        isChromium: true,
        headful: true,
        persistent: contextOptions,
        browserProcess,
        protocolLogger: helper.debugProtocolLogger(),
        browserLogsCollector,
        originalLaunchOptions: {},
        artifactsDir: '.',
        downloadsPath: '.',
        tracesDir: '.'
      };
      validateBrowserContextOptions(contextOptions, browserOptions);
      const browser = await CRBrowser.connect(this.attribution.playwright, transport, browserOptions);
      browser.on(Browser.Events.Disconnected, doCloseTransport);
      const context = browser._defaultContext;
      if (!context) throw new Error(`Browser context is null`);
      context.on(BrowserContext.Events.Close, () => {
        // Emit crx closed after context closed.
        Promise.resolve().then(() => this.emit(Crx.Events.Close));
      });
      this._browserContext = context;
      return context;
    }, TimeoutSettings.timeout(options));
  }
}
