// Main exports for @pustac/editor package

export { PustacEditor } from './editor';
export { 
  editorState, 
  editorActions, 
  focusMode, 
  typewriterMode 
} from './state';
export { 
  loadFeature, 
  preloadFeatures, 
  loadRichText, 
  loadList, 
  loadCode, 
  loadLink, 
  loadMarkdown 
} from './lazy-loading';
export { 
  PustacHeadingNode,
  PustacQuoteNode,
  PustacListNode,
  PustacListItemNode,
  customNodes
} from './nodes';
export { AutoFormattingPlugin } from './plugins/auto-formatting';
export { LazyLoadingPlugin, useLazyFeature } from './plugins/lazy-loading';
export type { 
  EditorConfig, 
  EditorState, 
  EditorActions, 
  PustacEditor as PustacEditorType 
} from './types';

// Import styles
import './styles.css';

