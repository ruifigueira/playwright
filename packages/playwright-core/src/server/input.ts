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

import { assert } from '../utils';
import type * as types from './types';
import type { Page } from './page';
import type { KeyboardLayout } from './keyboards';
import { defaultKeyboardLayout, defaultKeyboardLayoutName, keyboardLayoutNamesMapping } from './keyboards';

export { keypadLocation } from './keyboards';

type KeyDescription = {
  keyCode: number,
  keyCodeWithoutLocation: number,
  key: string,
  text: string,
  code: string,
  location: number,
  shifted?: KeyDescription;
  ctrlAlted?: KeyDescription;
  deadKeyMappings?: Map<string, string>;
};

// either the key description or a sequence of keys for accented keys
// e.g. in portuguese, 'à' will be ['Shift+BracketRight', 'a']
type KeyboardLayoutClosure = Map<string, KeyDescription | string[]>;

const kModifiers: types.KeyboardModifier[] = ['Alt', 'Control', 'Meta', 'Shift'];

export interface RawKeyboard {
  keydown(modifiers: Set<types.KeyboardModifier>, code: string, keyCode: number, keyCodeWithoutLocation: number, key: string, location: number, autoRepeat: boolean, text: string | undefined): Promise<void>;
  keyup(modifiers: Set<types.KeyboardModifier>, code: string, keyCode: number, keyCodeWithoutLocation: number, key: string, location: number): Promise<void>;
  sendText(text: string): Promise<void>;
}

export class Keyboard {
  private _pressedModifiers = new Set<types.KeyboardModifier>();
  private _pressedKeys = new Set<string>();
  private _raw: RawKeyboard;
  private _page: Page;
  private _keyboardLayout: KeyboardLayoutClosure;
  private _deadKey?: KeyDescription;

  constructor(raw: RawKeyboard, page: Page) {
    this._raw = raw;
    this._page = page;
    this._keyboardLayout = getByKeyboardLayoutName(page._browserContext._options.keyboardLayout);
  }

  changeLayout(layoutName: string) {
    this._keyboardLayout = getByKeyboardLayoutName(layoutName);
  }

  async down(key: string) {
    const description = this._keyDescriptionForString(key);
    if (description.text) this._deadKey = undefined;
    const autoRepeat = this._pressedKeys.has(description.code);
    this._pressedKeys.add(description.code);
    if (kModifiers.includes(description.key as types.KeyboardModifier))
      this._pressedModifiers.add(description.key as types.KeyboardModifier);
    const descKey = description.deadKeyMappings ? 'Dead' : description.key;
    await this._raw.keydown(this._pressedModifiers, description.code, description.keyCode, description.keyCodeWithoutLocation, descKey, description.location, autoRepeat, description.text);
  }

  private _keyDescriptionForString(keyString: string): KeyDescription {
    let description = this._keyboardLayout.get(keyString);
    assert(description, `Unknown key: "${keyString}"`);
    assert(!Array.isArray(description), `Accented key not supported: "${keyString}"`);

    const ctrlAlt = this._pressedModifiers.has('Alt') && this._pressedModifiers.has('Control');
    const shift = this._pressedModifiers.has('Shift');

    // if it's modifiers + key but key's modifiers are not pressed, no text should be sent
    if (this._pressedModifiers.size > 0 && ((description.shifted === description && !shift) || (description.ctrlAlted === description && !ctrlAlt))) return { ...description, text: '' };

    if (shift) {
      // if any modifiers besides shift are pressed, no text should be sent
      if (this._pressedModifiers.size > 1) return { ...description, text: '' };
      description = description.shifted ?? description;
    }

    if (ctrlAlt) {
      // if there's no key for crtl+alt or any modifiers besides those are pressed, no text should be sent
      if (!description.ctrlAlted || this._pressedModifiers.size > 2) return { ...description, text: '' };
      description = description.ctrlAlted;
    }

    if (!this._deadKey?.deadKeyMappings || kModifiers.includes(description.key as types.KeyboardModifier)) return description;

    // handle deadkeys / accented keys
    const deadKeyText = this._deadKey.deadKeyMappings.get(description.text);

    if (deadKeyText !== undefined)
      return { ...description, text: deadKeyText, key: deadKeyText };

    // key has no accented form
    const accentText = this._deadKey.deadKeyMappings.get(' ')!;

    return { ...description, text: accentText + description.text };
  }

  async up(key: string) {
    const description = this._keyDescriptionForString(key);
    if (kModifiers.includes(description.key as types.KeyboardModifier))
      this._pressedModifiers.delete(description.key as types.KeyboardModifier);
    this._pressedKeys.delete(description.code);
    const descKey = description.deadKeyMappings ? 'Dead' : description.key;
    if (description.text) this._deadKey = description;
    await this._raw.keyup(this._pressedModifiers, description.code, description.keyCode, description.keyCodeWithoutLocation, descKey, description.location);
  }

  async insertText(text: string) {
    await this._raw.sendText(text);
  }

  async type(text: string, options?: { delay?: number }) {
    const delay = (options && options.delay) || undefined;
    for (const char of text) {
      const descOrKeySequence = this._keyboardLayout.get(char);
      if (descOrKeySequence) {
        if (Array.isArray(descOrKeySequence)) {
          for (const key of descOrKeySequence)
            await this.press(key, { delay });
        } else {
          await this.press(char, { delay });
        }
      } else {
        if (delay)
          await new Promise(f => setTimeout(f, delay));
        await this.insertText(char);
      }
    }
  }

  async press(key: string, options: { delay?: number } = {}) {
    function split(keyString: string) {
      const keys = [];
      let building = '';
      for (const char of keyString) {
        if (char === '+' && building) {
          keys.push(building);
          building = '';
        } else {
          building += char;
        }
      }
      keys.push(building);
      return keys;
    }

    const tokens = split(key);
    const promises = [];
    key = tokens[tokens.length - 1];
    for (let i = 0; i < tokens.length - 1; ++i)
      promises.push(this.down(tokens[i]));
    promises.push(this.down(key));
    if (options.delay) {
      await Promise.all(promises);
      await new Promise(f => setTimeout(f, options.delay));
    }
    promises.push(this.up(key));
    for (let i = tokens.length - 2; i >= 0; --i)
      promises.push(this.up(tokens[i]));
    await Promise.all(promises);
  }

  async _ensureModifiers(modifiers: types.KeyboardModifier[]): Promise<types.KeyboardModifier[]> {
    for (const modifier of modifiers) {
      if (!kModifiers.includes(modifier))
        throw new Error('Unknown modifier ' + modifier);
    }
    const restore: types.KeyboardModifier[] = Array.from(this._pressedModifiers);
    const promises: Promise<void>[] = [];
    for (const key of kModifiers) {
      const needDown = modifiers.includes(key);
      const isDown = this._pressedModifiers.has(key);
      if (needDown && !isDown)
        promises.push(this.down(key));
      else if (!needDown && isDown)
        promises.push(this.up(key));
    }
    await Promise.all(promises);
    return restore;
  }

  _modifiers(): Set<types.KeyboardModifier> {
    return this._pressedModifiers;
  }
}

export interface RawMouse {
  move(x: number, y: number, button: types.MouseButton | 'none', buttons: Set<types.MouseButton>, modifiers: Set<types.KeyboardModifier>, forClick: boolean): Promise<void>;
  down(x: number, y: number, button: types.MouseButton, buttons: Set<types.MouseButton>, modifiers: Set<types.KeyboardModifier>, clickCount: number): Promise<void>;
  up(x: number, y: number, button: types.MouseButton, buttons: Set<types.MouseButton>, modifiers: Set<types.KeyboardModifier>, clickCount: number): Promise<void>;
  wheel(x: number, y: number, buttons: Set<types.MouseButton>, modifiers: Set<types.KeyboardModifier>, deltaX: number, deltaY: number): Promise<void>;
}

export class Mouse {
  private _keyboard: Keyboard;
  private _x = 0;
  private _y = 0;
  private _lastButton: 'none' | types.MouseButton = 'none';
  private _buttons = new Set<types.MouseButton>();
  private _raw: RawMouse;
  private _page: Page;

  constructor(raw: RawMouse, page: Page) {
    this._raw = raw;
    this._page = page;
    this._keyboard = this._page.keyboard;
  }

  async move(x: number, y: number, options: { steps?: number, forClick?: boolean } = {}) {
    const { steps = 1 } = options;
    const fromX = this._x;
    const fromY = this._y;
    this._x = x;
    this._y = y;
    for (let i = 1; i <= steps; i++) {
      const middleX = fromX + (x - fromX) * (i / steps);
      const middleY = fromY + (y - fromY) * (i / steps);
      await this._raw.move(middleX, middleY, this._lastButton, this._buttons, this._keyboard._modifiers(), !!options.forClick);
    }
  }

  async down(options: { button?: types.MouseButton, clickCount?: number } = {}) {
    const { button = 'left', clickCount = 1 } = options;
    this._lastButton = button;
    this._buttons.add(button);
    await this._raw.down(this._x, this._y, this._lastButton, this._buttons, this._keyboard._modifiers(), clickCount);
  }

  async up(options: { button?: types.MouseButton, clickCount?: number } = {}) {
    const { button = 'left', clickCount = 1 } = options;
    this._lastButton = 'none';
    this._buttons.delete(button);
    await this._raw.up(this._x, this._y, button, this._buttons, this._keyboard._modifiers(), clickCount);
  }

  async click(x: number, y: number, options: { delay?: number, button?: types.MouseButton, clickCount?: number } = {}) {
    const { delay = null, clickCount = 1 } = options;
    if (delay) {
      this.move(x, y, { forClick: true });
      for (let cc = 1; cc <= clickCount; ++cc) {
        await this.down({ ...options, clickCount: cc });
        await new Promise(f => setTimeout(f, delay));
        await this.up({ ...options, clickCount: cc });
        if (cc < clickCount)
          await new Promise(f => setTimeout(f, delay));
      }
    } else {
      const promises = [];
      promises.push(this.move(x, y, { forClick: true }));
      for (let cc = 1; cc <= clickCount; ++cc) {
        promises.push(this.down({ ...options, clickCount: cc }));
        promises.push(this.up({ ...options, clickCount: cc }));
      }
      await Promise.all(promises);
    }
  }

  async dblclick(x: number, y: number, options: { delay?: number, button?: types.MouseButton } = {}) {
    await this.click(x, y, { ...options, clickCount: 2 });
  }

  async wheel(deltaX: number, deltaY: number) {
    await this._raw.wheel(this._x, this._y, this._buttons, this._keyboard._modifiers(), deltaX, deltaY);
  }
}

const aliases = new Map<string, string[]>([
  ['ShiftLeft', ['Shift']],
  ['ControlLeft', ['Control']],
  ['AltLeft', ['Alt']],
  ['MetaLeft', ['Meta']],
  ['Enter', ['\n', '\r']],
]);

const defaultKeyboard = _buildLayoutClosure(defaultKeyboardLayout);
const cache = new Map<string, KeyboardLayoutClosure>(
    // initialized with the default keyboard layout
    [[defaultKeyboardLayoutName, defaultKeyboard]]
);

function getByKeyboardLayoutName(layoutName?: string): KeyboardLayoutClosure {
  if (!layoutName) return defaultKeyboard;

  const normalizedLayoutName = normalizeLayoutName(layoutName);
  const klid = keyboardLayoutNamesMapping.get(normalizedLayoutName);
  if (!klid) throw new Error(`Keyboard layout name "${layoutName}" not found`);

  const cached = cache.get(klid);
  if (cached) return cached;

  const layout: KeyboardLayout = require(`./keyboards/layouts/${klid}`).default;
  assert(layout, `No layout found for klid ${klid}`);

  const result = _buildLayoutClosure(layout);

  cache.set(klid, result);
  return result;
}

function normalizeLayoutName(layoutName: string) {
  return layoutName.replace(/-/g, '_').toLowerCase();
}

function isKeyCodeOrModifier(layout: KeyboardLayout, key?: string) {
  return key && (key in layout || kModifiers.includes(key as types.KeyboardModifier));
}

function _buildLayoutClosure(layout: KeyboardLayout): KeyboardLayoutClosure {
  const result = new Map<string, KeyDescription | string[]>();
  for (const code in layout) {
    const definition = layout[code];
    const description: KeyDescription = {
      key: definition.key || '',
      keyCode: definition.keyCode || 0,
      keyCodeWithoutLocation: definition.keyCodeWithoutLocation || definition.keyCode || 0,
      code,
      text: definition.text || '',
      location: definition.location || 0,
      deadKeyMappings: definition.key && definition.deadKeyMappings ? new Map(Object.entries(definition.deadKeyMappings)) : undefined,
    };
    if (!isKeyCodeOrModifier(layout, definition.key))
      description.text = description.key;

    // Generate shifted definition.
    let shiftedDescription: KeyDescription | undefined;
    if (definition.shiftKey) {
      shiftedDescription = { ...description };
      shiftedDescription.key = definition.shiftKey;
      shiftedDescription.text = definition.shiftKey;
      shiftedDescription.shifted = shiftedDescription;
      if (definition.shiftKeyCode)
        shiftedDescription.keyCode = definition.shiftKeyCode;
      if (definition.shiftDeadKeyMappings)
        shiftedDescription.deadKeyMappings = new Map(Object.entries(definition.shiftDeadKeyMappings));
    }

    // Map from code: Digit3 -> { ... descrption, shifted }
    result.set(code, { ...description, shifted: shiftedDescription });

    // Generate alt definition.
    let ctrlAltDescription: KeyDescription | undefined;
    if (definition.ctrlAltKey) {
      ctrlAltDescription = { ...description };
      ctrlAltDescription.key = definition.ctrlAltKey;
      ctrlAltDescription.text = definition.ctrlAltKey;
      ctrlAltDescription.ctrlAlted = ctrlAltDescription;
      if (definition.ctrlAltKeyCode)
        ctrlAltDescription.keyCode = definition.ctrlAltKeyCode;
      if (definition.ctrlAltDeadKeyMappings)
        ctrlAltDescription.deadKeyMappings = new Map(Object.entries(definition.ctrlAltDeadKeyMappings));
    }

    // Map from code: Digit3 -> { ... descrption, shifted }
    result.set(code, { ...description, shifted: shiftedDescription, ctrlAlted: ctrlAltDescription });

    // Map from aliases: Shift -> non-shiftable definition
    if (aliases.has(code)) {
      for (const alias of aliases.get(code)!)
        result.set(alias, description);
    }

    // Do not use numpad when converting keys to codes.
    if (definition.location)
      continue;

    // Map from key, no shifted
    if (!isKeyCodeOrModifier(layout, definition.key))
      result.set(description.key, description);

    // Map from accented keys
    if (definition.deadKeyMappings) {
      for (const [k, v] of Object.entries(definition.deadKeyMappings))
        // if there's a dedicated accented key, we don't want to replace them
        if (!result.has(v)) result.set(v, [code, k]);
    }

    if (shiftedDescription) {
      // Map from shiftKey
      result.set(shiftedDescription.key, shiftedDescription);

      // Map from shifted accented keys
      if (definition.shiftDeadKeyMappings) {
        for (const [k, v] of Object.entries(definition.shiftDeadKeyMappings))
          // if there's a dedicated accented key, we don't want to replace them
          if (!result.has(v)) result.set(v, [`Shift+${code}`, k]);
      }
    }

    if (ctrlAltDescription) {
      // Map from altKey
      result.set(ctrlAltDescription.key, ctrlAltDescription);

      // Map from shifted accented keys
      if (definition.ctrlAltDeadKeyMappings) {
        for (const [k, v] of Object.entries(definition.ctrlAltDeadKeyMappings))
          // if there's a dedicated accented key, we don't want to replace them
          if (!result.has(v)) result.set(v, [`Control+Alt+${code}`, k]);
      }
    }
  }
  return result;
}

export interface RawTouchscreen {
  tap(x: number, y: number, modifiers: Set<types.KeyboardModifier>): Promise<void>;
}

export class Touchscreen {
  private _raw: RawTouchscreen;
  private _page: Page;

  constructor(raw: RawTouchscreen, page: Page) {
    this._raw = raw;
    this._page = page;
  }

  async tap(x: number, y: number) {
    if (!this._page._browserContext._options.hasTouch)
      throw new Error('hasTouch must be enabled on the browser context before using the touchscreen.');
    await this._raw.tap(x, y, this._page.keyboard._modifiers());
  }
}
