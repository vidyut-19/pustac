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
export type { 
  EditorConfig, 
  EditorState, 
  EditorActions, 
  PustacEditor as PustacEditorType 
} from './types';

// Import styles
import './styles.css';

