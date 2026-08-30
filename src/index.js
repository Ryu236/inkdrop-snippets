'use babel';

import { CompositeDisposable } from 'event-kit';
import { Database } from './Database';
import { Editor } from './Editor';

let database = null;
let editor = null;
let subscriptions = null;

export const config = {
  configNotes: {
    title: 'Configuration notes',
    description: 'Comma-separated list of note ids of configuration notes',
    type: 'string',
    default: '',
  },
};

export function activate() {
  database = new Database();
  subscriptions = new CompositeDisposable();

  const activeEditor = inkdrop.getActiveEditor();
  if (activeEditor != null) {
    editor = new Editor(activeEditor, database);
  } else {
    subscriptions.add(
      inkdrop.onEditorLoad(e => {
        editor = new Editor(e, database);
      }),
    );
  }

  subscriptions.add(
    inkdrop.onEditorUnload(() => {
      if (editor !== null) {
        editor.dispose();
      }
    }),
  );
}

export function deactivate() {
  database.dispose();
  // `editor` is only assigned once an editor is actually loaded/active; if the plugin
  // is deactivated before that happens (e.g. no note was ever opened), it's still null.
  if (editor !== null) {
    editor.dispose();
  }
  subscriptions.dispose();
}
