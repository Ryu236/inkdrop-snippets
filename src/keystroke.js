'use babel';

// A pragmatic reimplementation of the one piece of inkdrop-keymap's keystroke parsing
// this plugin depends on. Older Inkdrop versions exposed
// `inkdrop.keymaps.keystrokeForKeyboardEvent` for this; it's gone from v6's public
// KeymapManager (only `findKeyBindings` remains), so Editor.js builds the query string
// itself. This only needs to be good enough to query `findKeyBindings()` with, not to
// reproduce every edge case of key naming, so it always emits modifiers explicitly
// (ctrl/alt/shift/cmd) plus a lowercased key name, which matches regardless of whether
// a competing binding was itself authored with an explicit "shift-" token or an
// implied-by-case key (e.g. "cmd-Z" for cmd-shift-z).
const SPECIAL_KEY_NAMES = {
  ' ': 'space',
  Escape: 'escape',
  Enter: 'enter',
  Tab: 'tab',
  Backspace: 'backspace',
  Delete: 'delete',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  Home: 'home',
  End: 'end',
};

const MODIFIER_KEYS = ['Control', 'Alt', 'Shift', 'Meta', 'OS', 'AltGraph'];

export function keystrokeForKeyboardEvent(event) {
  if (MODIFIER_KEYS.includes(event.key)) {
    return null;
  }

  const modifiers = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey) modifiers.push('shift');
  if (event.metaKey) modifiers.push('cmd');

  const key = SPECIAL_KEY_NAMES[event.key] || event.key.toLowerCase();

  return [...modifiers, key].join('-');
}
