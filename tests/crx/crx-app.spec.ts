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
import { crxTest as test, expect } from './crxTest';

type Tab = chrome.tabs.Tab;

test('should work @smoke', async ({ crx, context }) => {
  const numPages = context.pages().length;
  const newPage = await crx.newPage();
  expect(context.pages()).toHaveLength(numPages + 1);
  let closed = false;
  newPage.once('close', () => {
    closed = true;
  });
  await newPage.close();
  expect(context.pages()).toHaveLength(numPages);
  expect(closed).toBeTruthy();
});

test('should add attached page to context', async ({ crx, context }) => {
  const tab = await chrome.tabs.create({ url: 'about:blank' });
  const page = await crx.attach(tab.id!);
  expect(context.pages()).toContain(page);
});

test('should remove detached page from context', async ({ crx, context }) => {
  const tab = await chrome.tabs.create({ url: 'about:blank' });
  const page = await crx.attach(tab.id!);
  await crx.detach(tab.id!);
  expect(context.pages()).not.toContain(page);
});

test('should create new page', async ({ crx, context, server }) => {
  const window = await chrome.windows.create();
  const tabPromise = new Promise<Tab>(x => chrome.tabs.onCreated.addListener(x));
  const page = await crx.newPage({
    windowId: window.id,
    url: server.EMPTY_PAGE,
  });
  expect(context.pages()).toContain(page);
  expect(page.url()).toBe(server.EMPTY_PAGE);

  const { id: tabId } = await tabPromise;
  const tab = await chrome.tabs.get(tabId);
  expect(tab.url).toBe(server.EMPTY_PAGE);
  expect(tab.windowId).toBe(window.id);
});

test('should attach with query url as string', async ({ crx, server }) => {
  await chrome.tabs.create({ url: server.EMPTY_PAGE });
  const [p1] = await crx.attachAll({
    url: server.EMPTY_PAGE
  });
  expect(p1).toBeTruthy();
});

test('should attach with query url as array of strings', async ({ crx, server }) => {
  await Promise.all([
    chrome.tabs.create({ url: server.EMPTY_PAGE }),
    chrome.tabs.create({ url: server.PREFIX + '/input/button.html' }),
    chrome.tabs.create({ url: 'about:blank' }),
  ]);
  const pages = await crx.attachAll({
    url: [server.EMPTY_PAGE, server.PREFIX + '/input/button.html'],
  });
  expect(pages).toHaveLength(2);
  const urls = pages.map(p => p.url());
  expect(urls).toContain(server.EMPTY_PAGE);
  expect(urls).toContain(server.PREFIX + '/input/button.html');
});


test('should attach matching pages', async ({ crx, context, server }) => {
  const { id: windowId } = await chrome.windows.create();
  await Promise.all([
    chrome.tabs.create({ url: server.EMPTY_PAGE }),
    chrome.tabs.create({ url: server.EMPTY_PAGE, windowId }),
    chrome.tabs.create({ url: 'about:blank', windowId }),
  ]);
  const pages = await crx.attachAll({
    url: server.EMPTY_PAGE
  });
  expect(pages).toHaveLength(2);
  const [p1, p2] = pages;
  expect(p1).toBeTruthy();
  expect(p2).toBeTruthy();
  expect(context.pages()).toContain(p1);
  expect(context.pages()).toContain(p2);
  expect(p1.url()).toBe(server.EMPTY_PAGE);
  expect(p2.url()).toBe(server.EMPTY_PAGE);
});
