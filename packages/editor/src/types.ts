
export interface EditorConfig {
  theme?: any;
  nodes?: any[];
  plugins?: any[];
  editable?: boolean;
  focusMode?: boolean;
  typewriterMode?: boolean;
}

export interface EditorState {
  isFocused: boolean;
  hasSelection: boolean;
  currentParagraph?: string;
  wordCount: number;
  characterCount: number;
}

export interface EditorActions {
  focus: () => void;
  blur: () => void;
  toggleFocusMode: () => void;
  toggleTypewriterMode: () => void;
  insertText: (text: string) => void;
  insertParagraph: () => void;
  insertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
}

export interface PustacEditor {
  state: EditorState;
  actions: EditorActions;
  editor: any; // Lexical editor instance
}

