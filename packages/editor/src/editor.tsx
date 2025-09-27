import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { editorActions, focusMode } from './state';
import { preloadFeatures } from './lazy-loading';

// Basic theme for the editor
const theme = {
  paragraph: 'pustac-paragraph',
  heading: {
    h1: 'pustac-h1',
    h2: 'pustac-h2',
    h3: 'pustac-h3',
    h4: 'pustac-h4',
    h5: 'pustac-h5',
    h6: 'pustac-h6',
  },
  list: {
    nested: {
      listitem: 'pustac-nested-listitem',
    },
    ol: 'pustac-list-ol',
    ul: 'pustac-list-ul',
    listitem: 'pustac-listitem',
  },
  quote: 'pustac-quote',
  code: 'pustac-code',
  codeHighlight: {
    atrule: 'pustac-token-attr',
    attr: 'pustac-token-attr',
    boolean: 'pustac-token-boolean',
    builtin: 'pustac-token-builtin',
    cdata: 'pustac-token-cdata',
    char: 'pustac-token-char',
    class: 'pustac-token-class',
    'class-name': 'pustac-token-class-name',
    comment: 'pustac-token-comment',
    constant: 'pustac-token-constant',
    deleted: 'pustac-token-deleted',
    doctype: 'pustac-token-doctype',
    entity: 'pustac-token-entity',
    function: 'pustac-token-function',
    important: 'pustac-token-important',
    inserted: 'pustac-token-inserted',
    keyword: 'pustac-token-keyword',
    namespace: 'pustac-token-namespace',
    number: 'pustac-token-number',
    operator: 'pustac-token-operator',
    prolog: 'pustac-token-prolog',
    property: 'pustac-token-property',
    punctuation: 'pustac-token-punctuation',
    regex: 'pustac-token-regex',
    selector: 'pustac-token-selector',
    string: 'pustac-token-string',
    symbol: 'pustac-token-symbol',
    tag: 'pustac-token-tag',
    url: 'pustac-token-url',
    variable: 'pustac-token-variable',
  },
};

// Basic nodes for now (we'll add more with lazy loading)
const nodes = [
  // Core nodes are included by default
];

function onError(error: Error) {
  console.error('Lexical error:', error);
}

// Custom plugin to handle editor state changes
function StatePlugin() {
  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          const root = $getRoot();
          const selection = $getSelection();
          
          // Update word and character counts
          const textContent = root.getTextContent();
          const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
          editorActions.setWordCount(words.length);
          editorActions.setCharacterCount(textContent.length);
          
          // Update selection state
          editorActions.setSelection(selection !== null);
          
          // Update current paragraph (for focus mode)
          if (selection) {
            const anchorNode = selection.anchor.getNode();
            const paragraph = anchorNode.getParent();
            if (paragraph && paragraph.getType() === 'paragraph') {
              editorActions.setCurrentParagraph(paragraph.getTextContent());
            }
          }
        });
      }}
    />
  );
}

// Focus plugin to handle focus state
function FocusPlugin() {
  return (
    <div
      onFocus={() => {
        editorActions.setFocused(true);
        preloadFeatures(); // Preload features on first focus
      }}
      onBlur={() => editorActions.setFocused(false)}
    />
  );
}

export interface PustacEditorProps {
  initialConfig?: any;
  className?: string;
}

export function PustacEditor({ initialConfig, className = '' }: PustacEditorProps) {
  const [config] = useState(() => ({
    theme,
    nodes,
    onError,
    editable: true,
    ...initialConfig,
  }));

  const focusModeClass = focusMode.value ? 'pustac-focus-mode' : '';

  return (
    <div className={`pustac-editor ${focusModeClass} ${className}`}>
      <LexicalComposer initialConfig={config}>
        <div className="pustac-editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="pustac-content-editable"
                placeholder="Start writing..."
              />
            }
            placeholder={<div className="pustac-placeholder">Start writing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <StatePlugin />
          <FocusPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

