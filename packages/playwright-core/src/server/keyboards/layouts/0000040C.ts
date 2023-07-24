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

// KLID 0000040C - French
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
  Backquote: { key: '²', keyCode: 222 },
  Digit1: { key: '&', keyCode: 49, shiftKey: '1' },
  Digit2: { key: 'é', keyCode: 50, shiftKey: '2' },
  Digit3: { key: '"', keyCode: 51, shiftKey: '3' },
  Digit4: { key: '\'', keyCode: 52, shiftKey: '4' },
  Digit5: { key: '(', keyCode: 53, shiftKey: '5' },
  Digit6: { key: '-', keyCode: 54, shiftKey: '6' },
  Digit7: { key: 'è', keyCode: 55, shiftKey: '7' },
  Digit8: { key: '_', keyCode: 56, shiftKey: '8' },
  Digit9: { key: 'ç', keyCode: 57, shiftKey: '9' },
  Digit0: { key: 'à', keyCode: 48, shiftKey: '0' },
  Minus: { key: ')', keyCode: 219, shiftKey: '°' },
  Equal: { key: '=', keyCode: 187, shiftKey: '+' },
  Backspace: { key: 'Backspace', keyCode: 8 },
  Tab: { key: 'Tab', keyCode: 9 },
  KeyQ: { key: 'a', keyCode: 65, shiftKey: 'A' },
  KeyW: { key: 'z', keyCode: 90, shiftKey: 'Z' },
  KeyE: { key: 'e', keyCode: 69, shiftKey: 'E' },
  KeyR: { key: 'r', keyCode: 82, shiftKey: 'R' },
  KeyT: { key: 't', keyCode: 84, shiftKey: 'T' },
  KeyY: { key: 'y', keyCode: 89, shiftKey: 'Y' },
  KeyU: { key: 'u', keyCode: 85, shiftKey: 'U' },
  KeyI: { key: 'i', keyCode: 73, shiftKey: 'I' },
  KeyO: { key: 'o', keyCode: 79, shiftKey: 'O' },
  KeyP: { key: 'p', keyCode: 80, shiftKey: 'P' },
  BracketLeft: { key: '^', keyCode: 221, shiftKey: '¨', deadKeyMappings: { 'a': 'â', 'e': 'ê', 'i': 'î', 'o': 'ô', 'u': 'û', 'A': 'Â', 'E': 'Ê', 'I': 'Î', 'O': 'Ô', 'U': 'Û', ' ': '^' }, shiftDeadKeyMappings: { 'a': 'ä', 'e': 'ë', 'i': 'ï', 'o': 'ö', 'u': 'ü', 'y': 'ÿ', 'A': 'Ä', 'E': 'Ë', 'I': 'Ï', 'O': 'Ö', 'U': 'Ü', ' ': '¨' } },
  BracketRight: { key: '$', keyCode: 186, shiftKey: '£' },
  Enter: { key: 'Enter', keyCode: 13, text: '\r' },
  CapsLock: { key: 'CapsLock', keyCode: 20 },
  KeyA: { key: 'q', keyCode: 81, shiftKey: 'Q' },
  KeyS: { key: 's', keyCode: 83, shiftKey: 'S' },
  KeyD: { key: 'd', keyCode: 68, shiftKey: 'D' },
  KeyF: { key: 'f', keyCode: 70, shiftKey: 'F' },
  KeyG: { key: 'g', keyCode: 71, shiftKey: 'G' },
  KeyH: { key: 'h', keyCode: 72, shiftKey: 'H' },
  KeyJ: { key: 'j', keyCode: 74, shiftKey: 'J' },
  KeyK: { key: 'k', keyCode: 75, shiftKey: 'K' },
  KeyL: { key: 'l', keyCode: 76, shiftKey: 'L' },
  Semicolon: { key: 'm', keyCode: 77, shiftKey: 'M' },
  Quote: { key: 'ù', keyCode: 192, shiftKey: '%' },
  Backslash: { key: '*', keyCode: 220, shiftKey: 'µ' },
  ShiftLeft: { key: 'Shift', keyCode: 160, keyCodeWithoutLocation: 16, location: 1 },
  IntlBackslash: { key: '<', keyCode: 226, shiftKey: '>' },
  KeyZ: { key: 'w', keyCode: 87, shiftKey: 'W' },
  KeyX: { key: 'x', keyCode: 88, shiftKey: 'X' },
  KeyC: { key: 'c', keyCode: 67, shiftKey: 'C' },
  KeyV: { key: 'v', keyCode: 86, shiftKey: 'V' },
  KeyB: { key: 'b', keyCode: 66, shiftKey: 'B' },
  KeyN: { key: 'n', keyCode: 78, shiftKey: 'N' },
  KeyM: { key: ',', keyCode: 188, shiftKey: '?' },
  Comma: { key: ';', keyCode: 190, shiftKey: '.' },
  Period: { key: ':', keyCode: 191, shiftKey: '/' },
  Slash: { key: '!', keyCode: 223, shiftKey: '§' },
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
