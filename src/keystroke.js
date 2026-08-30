'use babel';

// A pragmatic reimplementation of the one piece of inkdrop-keymap's keystroke parsing
// this plugin depends on. Older Inkdrop versions exposed
// `inkdrop.keymaps.keystrokeForKeyboardEvent` for this; it's gone from v6's public
// KeymapManager (only `findKeyBindings` remains), so Editor.js builds the query string
// itself. This only needs to be good enough to query `findKeyBindings()` with, not to
// reproduce every edge case of key naming (dead keys, IME composition, non-Latin
// layouts, ... - all handled by the real implementation this reimplements a subset
// of), but it does need to match Inkdrop's own normalization for the common case:
// - "Special" (non-printable) keys like Tab/Escape/ArrowUp have no alternate shifted
//   glyph, so their name is always lowercased and an explicit "shift" modifier is
//   added whenever Shift is held.
// - A single printable character instead encodes Shift via case: Shift+z produces
//   `event.key === 'Z'`, which keeps its case *and* still gets an explicit "shift"
//   modifier (`shift-Z`, not `shift-z`); Shift+1 produces `event.key === '!'`, which
//   is used as-is with no "shift" modifier, since the symbol itself already implies
//   Shift was held.
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

  const isSpecialKey = event.key.length > 1;
  const key = isSpecialKey
    ? SPECIAL_KEY_NAMES[event.key] || event.key.toLowerCase()
    : event.key;
  const impliesShift = isSpecialKey
    ? event.shiftKey
    : event.shiftKey && /^[A-Z]$/.test(event.key);

  const modifiers = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (impliesShift) modifiers.push('shift');
  if (event.metaKey) modifiers.push('cmd');

  return [...modifiers, key].join('-');
}
