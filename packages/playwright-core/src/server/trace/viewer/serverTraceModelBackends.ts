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

import type { TraceModelBackend } from '@isomorphic/trace/traceModel';
import fs from 'fs';
import path from 'path';
import { ZipFile } from '../../../utils/zipFile';

type Progress = (done: number, total: number) => undefined;

export class ZipTraceModelBackend implements TraceModelBackend {
  private _zipReader: ZipFile;
  private _traceURL: string;

  constructor(traceURL: string, progress: Progress) {
    this._traceURL = traceURL;
    this._zipReader = new ZipFile(traceURL);
  }

  isLive() {
    return false;
  }

  traceURL() {
    return this._traceURL;
  }

  async entryNames(): Promise<string[]> {
    return await this._zipReader.entries();
  }

  async hasEntry(entryName: string): Promise<boolean> {
    return await this._zipReader.has(entryName);
  }

  async readText(entryName: string): Promise<string | undefined> {
    if (!await this.hasEntry(entryName))
      return;
    const buffer = await this._zipReader.read(entryName);
    return buffer.toString('utf8');
  }

  async readBlob(entryName: string): Promise<Blob | undefined> {
    if (!await this.hasEntry(entryName))
      return;
    const buffer = await this._zipReader.read(entryName);
    return new Blob([buffer]);
  }
}

export class LiveTraceModelBackend implements TraceModelBackend {
  private _entriesPromise: Promise<Map<string, string>>;
  private _traceJsonPath: string;

  constructor(traceJsonPath: string) {
    this._traceJsonPath = traceJsonPath;
    this._entriesPromise = fs.promises.readFile(traceJsonPath, { encoding: 'utf8' }).then(async response => {
      const json = JSON.parse(response);
      const entries = new Map<string, string>();
      for (const entry of json.entries)
        entries.set(entry.name, entry.path);
      return entries;
    });
  }

  isLive() {
    return true;
  }

  traceURL(): string {
    return this._traceJsonPath;
  }

  async entryNames(): Promise<string[]> {
    const entries = await this._entriesPromise;
    return [...entries.keys()];
  }

  async hasEntry(entryName: string): Promise<boolean> {
    const entries = await this._entriesPromise;
    return entries.has(entryName);
  }

  async readText(entryName: string): Promise<string | undefined> {
    try {
      const filepath = path.join(this._traceJsonPath, '..', entryName);
      return await fs.promises.readFile(filepath, { encoding: 'utf8' });
    } catch {
      return undefined;
    }
  }

  async readBlob(entryName: string): Promise<Blob | undefined> {
    try {
      const filepath = path.join(this._traceJsonPath, '..', entryName);
      const buffer = await fs.promises.readFile(filepath);
      return new Blob([buffer]);
    } catch {
      return undefined;
    }
  }
}
