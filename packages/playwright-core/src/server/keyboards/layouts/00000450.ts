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

// This file is generated by generate_keyboard_layouts.js, do not edit manually.

import type { KeyboardLayout } from '../types';

// KLID 00000450 - Mongolian Cyrillic keyboard
const keyboardLayout: KeyboardLayout = {
  Escape: { key: 'Escape', keyCode: 27 },
  F1: { key: 'F1', keyCode: 112 },
  F2: { key: 'F2', keyCode: 113 },
  F3: { key: 'F3', keyCode: 114 },
  F4: { key: 'F4', keyCode: 115 },
  F5: { key: 'F5', keyCode: 116 },
  F6: { key: 'F6', keyCode: 117 },
  F7: { key: 'F7', keyCode: 118 },
  F8: { key: 'F8', keyCode: 119 },
  F9: { key: 'F9', keyCode: 120 },
  F10: { key: 'F10', keyCode: 121 },
  F11: { key: 'F11', keyCode: 122 },
  F12: { key: 'F12', keyCode: 123 },
  Backquote: { key: '=', keyCode: 192, shiftKey: '+' },
  Digit1: { key: '№', keyCode: 49, shiftKey: '1' },
  Digit2: { key: '-', keyCode: 50, shiftKey: '2' },
  Digit3: { key: '"', keyCode: 51, shiftKey: '3' },
  Digit4: { key: '₮', keyCode: 52, shiftKey: '4' },
  Digit5: { key: ':', keyCode: 53, shiftKey: '5' },
  Digit6: { key: '.', keyCode: 54, shiftKey: '6' },
  Digit7: { key: '_', keyCode: 55, shiftKey: '7' },
  Digit8: { key: ',', keyCode: 56, shiftKey: '8' },
  Digit9: { key: '%', keyCode: 57, shiftKey: '9' },
  Digit0: { key: '?', keyCode: 48, shiftKey: '0' },
  Minus: { key: 'е', keyCode: 189, shiftKey: 'Е' },
  Equal: { key: 'щ', keyCode: 187, shiftKey: 'Щ' },
  Backspace: { key: 'Backspace', keyCode: 8 },
  Tab: { key: 'Tab', keyCode: 9 },
  KeyQ: { key: 'ф', keyCode: 81, shiftKey: 'Ф' },
  KeyW: { key: 'ц', keyCode: 87, shiftKey: 'Ц' },
  KeyE: { key: 'у', keyCode: 69, shiftKey: 'У' },
  KeyR: { key: 'ж', keyCode: 82, shiftKey: 'Ж' },
  KeyT: { key: 'э', keyCode: 84, shiftKey: 'Э' },
  KeyY: { key: 'н', keyCode: 89, shiftKey: 'Н' },
  KeyU: { key: 'г', keyCode: 85, shiftKey: 'Г' },
  KeyI: { key: 'ш', keyCode: 73, shiftKey: 'Ш' },
  KeyO: { key: 'ү', keyCode: 79, shiftKey: 'Ү' },
  KeyP: { key: 'з', keyCode: 80, shiftKey: 'З' },
  BracketLeft: { key: 'к', keyCode: 219, shiftKey: 'К' },
  BracketRight: { key: 'ъ', keyCode: 221, shiftKey: 'Ъ' },
  Enter: { key: 'Enter', keyCode: 13, text: '\r' },
  CapsLock: { key: 'CapsLock', keyCode: 20 },
  KeyA: { key: 'й', keyCode: 65, shiftKey: 'Й' },
  KeyS: { key: 'ы', keyCode: 83, shiftKey: 'Ы' },
  KeyD: { key: 'б', keyCode: 68, shiftKey: 'Б' },
  KeyF: { key: 'ө', keyCode: 70, shiftKey: 'Ө' },
  KeyG: { key: 'а', keyCode: 71, shiftKey: 'А' },
  KeyH: { key: 'х', keyCode: 72, shiftKey: 'Х' },
  KeyJ: { key: 'р', keyCode: 74, shiftKey: 'Р' },
  KeyK: { key: 'о', keyCode: 75, shiftKey: 'О' },
  KeyL: { key: 'л', keyCode: 76, shiftKey: 'Л' },
  Semicolon: { key: 'д', keyCode: 186, shiftKey: 'Д' },
  Quote: { key: 'п', keyCode: 222, shiftKey: 'П' },
  Backslash: { key: '\\', keyCode: 220, shiftKey: '|' },
  ShiftLeft: { key: 'Shift', keyCode: 160, keyCodeWithoutLocation: 16, location: 1 },
  IntlBackslash: { key: '\\', keyCode: 226, shiftKey: '|' },
  KeyZ: { key: 'я', keyCode: 90, shiftKey: 'Я' },
  KeyX: { key: 'ч', keyCode: 88, shiftKey: 'Ч' },
  KeyC: { key: 'ё', keyCode: 67, shiftKey: 'Ё' },
  KeyV: { key: 'с', keyCode: 86, shiftKey: 'С' },
  KeyB: { key: 'м', keyCode: 66, shiftKey: 'М' },
  KeyN: { key: 'и', keyCode: 78, shiftKey: 'И' },
  KeyM: { key: 'т', keyCode: 77, shiftKey: 'Т' },
  Comma: { key: 'ь', keyCode: 188, shiftKey: 'Ь' },
  Period: { key: 'в', keyCode: 190, shiftKey: 'В' },
  Slash: { key: 'ю', keyCode: 191, shiftKey: 'Ю' },
  ShiftRight: { key: 'Shift', keyCode: 161, keyCodeWithoutLocation: 16, location: 2 },
  ControlLeft: { key: 'Control', keyCode: 162, keyCodeWithoutLocation: 17, location: 1 },
  MetaLeft: { key: 'Meta', keyCode: 91, location: 1 },
  AltLeft: { key: 'Alt', keyCode: 164, keyCodeWithoutLocation: 18, location: 1 },
  Space: { key: ' ', keyCode: 32 },
  AltRight: { key: 'Alt', keyCode: 165, keyCodeWithoutLocation: 18, location: 2 },
  AltGraph: { key: 'AltGraph', keyCode: 225 },
  MetaRight: { key: 'Meta', keyCode: 92, location: 2 },
  ContextMenu: { key: 'ContextMenu', keyCode: 93 },
  ControlRight: { key: 'Control', keyCode: 163, keyCodeWithoutLocation: 17, location: 2 },
  PrintScreen: { key: 'PrintScreen', keyCode: 44 },
  ScrollLock: { key: 'ScrollLock', keyCode: 145 },
  Pause: { key: 'Pause', keyCode: 19 },
  PageUp: { key: 'PageUp', keyCode: 33 },
  PageDown: { key: 'PageDown', keyCode: 34 },
  Insert: { key: 'Insert', keyCode: 45 },
  Delete: { key: 'Delete', keyCode: 46 },
  Home: { key: 'Home', keyCode: 36 },
  End: { key: 'End', keyCode: 35 },
  ArrowLeft: { key: 'ArrowLeft', keyCode: 37 },
  ArrowUp: { key: 'ArrowUp', keyCode: 38 },
  ArrowRight: { key: 'ArrowRight', keyCode: 39 },
  ArrowDown: { key: 'ArrowDown', keyCode: 40 },
  NumLock: { key: 'NumLock', keyCode: 144 },
  NumpadDivide: { key: '/', keyCode: 111, location: 3 },
  NumpadMultiply: { key: '*', keyCode: 106, location: 3 },
  NumpadSubtract: { key: '-', keyCode: 109, location: 3 },
  Numpad7: { key: 'Home', keyCode: 36, shiftKey: '7', shiftKeyCode: 103, location: 3 },
  Numpad8: { key: 'ArrowUp', keyCode: 38, shiftKey: '8', shiftKeyCode: 104, location: 3 },
  Numpad9: { key: 'PageUp', keyCode: 33, shiftKey: '9', shiftKeyCode: 105, location: 3 },
  Numpad4: { key: 'ArrowLeft', keyCode: 37, shiftKey: '4', shiftKeyCode: 100, location: 3 },
  Numpad5: { key: 'Clear', keyCode: 12, shiftKey: '5', shiftKeyCode: 101, location: 3 },
  Numpad6: { key: 'ArrowRight', keyCode: 39, shiftKey: '6', shiftKeyCode: 102, location: 3 },
  NumpadAdd: { key: '+', keyCode: 107, location: 3 },
  Numpad1: { key: 'End', keyCode: 35, shiftKey: '1', shiftKeyCode: 97, location: 3 },
  Numpad2: { key: 'ArrowDown', keyCode: 40, shiftKey: '2', shiftKeyCode: 98, location: 3 },
  Numpad3: { key: 'PageDown', keyCode: 34, shiftKey: '3', shiftKeyCode: 99, location: 3 },
  Numpad0: { key: 'Insert', keyCode: 45, shiftKey: '0', shiftKeyCode: 96, location: 3 },
  NumpadDecimal: { key: '\u0000', keyCode: 46, shiftKey: '.', shiftKeyCode: 110, location: 3 },
  NumpadEnter: { key: 'Enter', keyCode: 13, text: '\r', location: 3 },
};

export default keyboardLayout;
