/**
 * Copyright 2018 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
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

import type { Progress } from '../progress';
import type { Protocol } from '../chromium/protocol';
import type { ConnectionTransport, ProtocolRequest, ProtocolResponse } from '../transport';

export class CrxTransport implements ConnectionTransport {
  private _progress?: Progress;
  private _attachedPromise?: Promise<void>;
  private _detachedPromise?: Promise<void>;
  private _targetToTab: Map<string, number>;
  private _tabToTarget: Map<number, string>;

  onmessage?: (message: ProtocolResponse) => void;
  onclose?: () => void;

  static async connect(progress?: Progress): Promise<CrxTransport> {
    progress?.log(`<chrome debugger connecting>`);
    const transport = new CrxTransport(progress);
    const success = false;
    progress?.cleanupWhenAborted(async () => {
      if (!success)
        await transport.closeAndWait().catch(e => null);
    });

    try {
      await transport._attachedPromise;
      progress?.log(`<chrome debugger connected>`);
      return transport;
    } catch (e: any) {
      progress?.log(`<chrome debugger connect error> ${e?.message}`);
      throw new Error(`ChromeDebugger connect error: ${e?.message}`);
    }
  }

  constructor(progress?: Progress) {
    this._progress = progress;
    this._tabToTarget = new Map();
    this._targetToTab = new Map();
    chrome.debugger.onEvent.addListener(this._onDebuggerEvent);
    chrome.tabs.onRemoved.addListener(tabId => {
      const targetId = this._tabToTarget.get(tabId);
      this._tabToTarget.delete(tabId);
      if (targetId) this._targetToTab.delete(targetId);
    });
  }

  async send(message: ProtocolRequest) {
    try {
      const [, tabIdStr] = /crx-tab-(\d+)/.exec(message.sessionId ?? '') ?? [];
      const tabId = tabIdStr ? parseInt(tabIdStr, 10) : undefined;

      let result;
      // chrome extensions doesn't support all CDP commands so we need to handle them
      if (message.method === 'Target.setAutoAttach' && !tabId) {
        // no tab to attach, just skip for now...
        result = await Promise.resolve().then();
      } else if (message.method === 'Target.getTargetInfo' && !tabId) {
        // most likely related with https://chromium-review.googlesource.com/c/chromium/src/+/2885888
        // See CRBrowser.connect
        result = await Promise.resolve().then();
      } else if (message.method === 'Target.createTarget') {
        const { id: tabId } = await chrome.tabs.create({ url: 'about:blank' });
        if (!tabId) throw new Error(`New tab has no id`);

        await chrome.debugger.attach({ tabId }, '1.3');

        const { targetInfo } = await this._send('Target.getTargetInfo', { tabId });
        const { targetId } = targetInfo;
        result = { targetId };

        this._tabToTarget.set(tabId, targetId);
        this._targetToTab.set(targetId, tabId);

        // we now use this session for events
        const sessionId = this._sessionIdFor(tabId);
        this._emitMessage({
          method: 'Target.attachedToTarget',
          sessionId: message.sessionId,
          params: {
            sessionId,
            targetInfo,
          }
        });
      } else if (message.method === 'Target.closeTarget') {
        const { targetId } = message.params;
        const tabId = this._targetToTab.get(targetId);
        if (tabId) {
          await chrome.tabs.remove(tabId);
          const sessionId = this._sessionIdFor(tabId);
          this._emitMessage({
            method: 'Target.detachedFromTarget',
            params: {
              sessionId,
              targetId,
            }
          });
          this._tabToTarget.delete(tabId);
        }
        this._targetToTab.delete(targetId);
        result = true;
      } else if (message.method === 'Target.createBrowserContext') {
        const allTabs = await chrome.tabs.query({});
        // let's try to get current browserContextId
        for (const { id: tabId } of allTabs) {
          if (!tabId) continue;

          try {
            await chrome.debugger.attach({ tabId }, '1.3');
            // we don't create a new browser context, just return the current one
            const { targetInfo: { targetId, browserContextId } } = await this._send('Target.getTargetInfo', { tabId });
            this._tabToTarget.set(tabId, targetId);
            this._targetToTab.set(targetId, tabId);
            result = { browserContextId };
            break;
          } catch (e) {
            // oh well, try the next one
          }
        }
        if (!result) throw Error('Could not get browser context ID');
      } else if (message.method === 'Target.disposeBrowserContext') {
        // do nothing...
        result = await Promise.resolve().then();
      } else if (message.method === 'Browser.getVersion') {
        const userAgent = navigator.userAgent;
        const [, product] = userAgent.match(/(Chrome\/[0-9\.]+)\b/) ?? [];
        result = await Promise.resolve({ product, userAgent }).then();
      } else if (message.method === 'Browser.getWindowForTarget') {
        // just don't send a window ID...
        result = await Promise.resolve({}).then();
      } else if (message.method === 'Browser.setDownloadBehavior') {
        // do nothing...
        result = await Promise.resolve().then();
      } else if (message.method === 'Emulation.setDeviceMetricsOverride') {
        // do nothing...
        result = await Promise.resolve().then();
      } else {
        // @ts-ignore
        result = await this._send(message.method, { tabId, ...message.params });
      }

      this._emitMessage({
        ...message,
        result,
      });
    } catch (error) {
      this._emitMessage({
        ...message,
        // @ts-ignore
        error,
      });
    }
  }

  close() {
    if (this._detachedPromise) return;
    console.log(`Closing CRX transport`);

    this._detachedPromise = Promise.all([...this._tabToTarget.keys()].map(async tabId => {
      await chrome.debugger.detach({ tabId }).catch(() => {});
      const targetId = this._tabToTarget.get(tabId);
      this._tabToTarget.delete(tabId);
      if (targetId) this._targetToTab.delete(targetId);
    })).then(() => {
      if (this.onclose)
        this.onclose();
    });
  }

  async closeAndWait() {
    this._progress?.log(`<chrome debugger disconnecting>`);
    chrome.debugger.onEvent.removeListener(this._onDebuggerEvent);
    this.close();
    await this._detachedPromise; // Make sure to await the actual disconnect.
    this._progress?.log(`<chrome debugger disconnected>`);
  }

  private async _send<T extends keyof Protocol.CommandParameters>(
    method: T,
    params?: Protocol.CommandParameters[T] & { tabId?: number }
  ) {
    const { tabId, ...commandParams } = params ?? {};
    // eslint-disable-next-line no-console
    if (!tabId) console.trace(`No tabId provided for ${method}`);

    return await chrome.debugger.sendCommand({ tabId }, method, commandParams) as
      Protocol.CommandReturnValues[T];
  }

  // @ts-ignore
  private _onDebuggerEvent = ({ tabId }: { tabId?: number }, message, params) => {
    if (!tabId) return;

    this._emitMessage({
      method: message,
      sessionId: this._sessionIdFor(tabId),
      params,
    });
  };

  private _emitMessage(message: ProtocolResponse) {
    if (this.onmessage)
      this.onmessage(message);
  }

  private _sessionIdFor(tabId: number): string {
    return `crx-tab-${tabId}`;
  }
}
