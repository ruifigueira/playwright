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

import url from 'url';
import path from 'path';
import { StackUtils } from 'playwright-core/lib/utilsBundle';
import { isUnderTest } from './';
import type { StackFrame } from '@protocol/channels';

const stackUtils = new StackUtils({ internals: StackUtils.nodeInternals() });
const nodeInternals = StackUtils.nodeInternals();
const nodeMajorVersion = +process.versions.node.split('.')[0];

export function rewriteErrorMessage<E extends Error>(e: E, newMessage: string): E {
  const lines: string[] = (e.stack?.split('\n') || []).filter(l => l.startsWith('    at '));
  e.message = newMessage;
  const errorTitle = `${e.name}: ${e.message}`;
  if (lines.length)
    e.stack = `${errorTitle}\n${lines.join('\n')}`;
  return e;
}

const CORE_DIR = path.resolve(__dirname, '..', '..');
const COVERAGE_PATH = path.join(CORE_DIR, '..', '..', 'tests', 'config', 'coverage.js');

const internalStackPrefixes = [
  CORE_DIR,
];
export const addInternalStackPrefix = (prefix: string) => internalStackPrefixes.push(prefix);

export type ParsedStackTrace = {
  allFrames: StackFrame[];
  frames: StackFrame[];
  frameTexts: string[];
  apiName: string | undefined;
};

export type RawStack = string[];

export function captureRawStack(): RawStack {
  const stackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 50;
  const error = new Error();
  const stack = error.stack || '';
  Error.stackTraceLimit = stackTraceLimit;
  return stack.split('\n');
}

export function captureLibraryStackTrace(rawStack?: RawStack): ParsedStackTrace {
  const stack = rawStack || captureRawStack();

  const isTesting = isUnderTest();
  type ParsedFrame = {
    frame: StackFrame;
    frameText: string;
    isPlaywrightLibrary: boolean;
  };
  let parsedFrames = stack.map(line => {
    const frame = parseStackTraceLine(line);
    if (!frame || !frame.file)
      return null;
    if (!process.env.PWDEBUGIMPL && isTesting && frame.file.includes(COVERAGE_PATH))
      return null;
    const isPlaywrightLibrary = frame.file.startsWith(CORE_DIR);
    const parsed: ParsedFrame = {
      frame,
      frameText: line,
      isPlaywrightLibrary
    };
    return parsed;
  }).filter(Boolean) as ParsedFrame[];

  let apiName = '';
  const allFrames = parsedFrames;

  // Deepest transition between non-client code calling into client
  // code is the api entry.
  for (let i = 0; i < parsedFrames.length - 1; i++) {
    const parsedFrame = parsedFrames[i];
    if (parsedFrame.isPlaywrightLibrary && !parsedFrames[i + 1].isPlaywrightLibrary) {
      apiName = apiName || normalizeAPIName(parsedFrame.frame.function);
      break;
    }
  }

  function normalizeAPIName(name?: string): string {
    if (!name)
      return '';
    const match = name.match(/(API|JS|CDP|[A-Z])(.*)/);
    if (!match)
      return name;
    return match[1].toLowerCase() + match[2];
  }

  // This is for the inspector so that it did not include the test runner stack frames.
  parsedFrames = parsedFrames.filter(f => {
    if (process.env.PWDEBUGIMPL)
      return true;
    if (internalStackPrefixes.some(prefix => f.frame.file.startsWith(prefix)))
      return false;
    return true;
  });

  return {
    allFrames: allFrames.map(p => p.frame),
    frames: parsedFrames.map(p => p.frame),
    frameTexts: parsedFrames.map(p => p.frameText),
    apiName
  };
}

export function splitErrorMessage(message: string): { name: string, message: string } {
  const separationIdx = message.indexOf(':');
  return {
    name: separationIdx !== -1 ? message.slice(0, separationIdx) : '',
    message: separationIdx !== -1 && separationIdx + 2 <= message.length ? message.substring(separationIdx + 2) : message,
  };
}

export function parseStackTraceLine(line: string): StackFrame | null {
  if (!process.env.PWDEBUGIMPL && nodeMajorVersion < 16 && nodeInternals.some(internal => internal.test(line)))
    return null;
  const frame = stackUtils.parseLine(line);
  if (!frame)
    return null;
  if (!process.env.PWDEBUGIMPL && (frame.file?.startsWith('internal') || frame.file?.startsWith('node:')))
    return null;
  if (!frame.file)
    return null;
  // ESM files return file:// URLs, see here: https://github.com/tapjs/stack-utils/issues/60
  const file = frame.file.startsWith('file://') ? url.fileURLToPath(frame.file) : path.resolve(process.cwd(), frame.file);
  return {
    file,
    line: frame.line || 0,
    column: frame.column || 0,
    function: frame.function,
  };
}

export type ExpectZone = {
  title: string;
  wallTime: number;
};
