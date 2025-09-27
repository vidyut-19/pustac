import { signal, computed } from '@preact/signals';

// Core editor state
export const isFocused = signal(false);
export const hasSelection = signal(false);
export const currentParagraph = signal<string | undefined>(undefined);
export const wordCount = signal(0);
export const characterCount = signal(0);

// Editor modes
export const focusMode = signal(false);
export const typewriterMode = signal(false);

// Computed state
export const editorState = computed(() => ({
  isFocused: isFocused.value,
  hasSelection: hasSelection.value,
  currentParagraph: currentParagraph.value,
  wordCount: wordCount.value,
  characterCount: characterCount.value,
}));

// Actions
export const editorActions = {
  setFocused: (focused: boolean) => {
    isFocused.value = focused;
  },
  
  setSelection: (hasSel: boolean) => {
    hasSelection.value = hasSel;
  },
  
  setCurrentParagraph: (paragraph: string | undefined) => {
    currentParagraph.value = paragraph;
  },
  
  setWordCount: (count: number) => {
    wordCount.value = count;
  },
  
  setCharacterCount: (count: number) => {
    characterCount.value = count;
  },
  
  toggleFocusMode: () => {
    focusMode.value = !focusMode.value;
  },
  
  toggleTypewriterMode: () => {
    typewriterMode.value = !typewriterMode.value;
  },
};

