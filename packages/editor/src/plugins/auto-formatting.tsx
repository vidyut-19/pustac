// Auto-formatting plugin for markdown-style shortcuts
import { useEffect } from 'preact/hooks';
import { 
  $getSelection, 
  $isRangeSelection, 
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $isElementNode,
  $isTextNode,
  LexicalEditor,
  $setSelection,
  $createRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
  KEY_SPACE_COMMAND
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createQuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Auto-formatting patterns
const AUTO_FORMAT_PATTERNS = {
  heading: /^(#{1,6})\s+(.+)$/,
  blockquote: /^>\s*(.+)$/,
  unorderedList: /^[-*+]\s+(.+)$/,
  orderedList: /^(\d+)\.\s+(.+)$/,
};

function handleAutoFormatting(editor: LexicalEditor, text: string, nodeKey: string): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return false;

  const node = $getNodeByKey(nodeKey);
  if (!$isTextNode(node)) return false;

  // Check for heading pattern (### Heading)
  const headingMatch = text.match(AUTO_FORMAT_PATTERNS.heading);
  if (headingMatch) {
    const [, hashes, content] = headingMatch;
    const level = hashes.length;
    
    editor.update(() => {
      const parent = node.getParent();
      if (!$isElementNode(parent)) return;

      // Create new heading node
      const headingNode = $createHeadingNode(`h${level}` as any);
      const textNode = $createTextNode(content);
      headingNode.append(textNode);

      // Replace the paragraph with heading
      parent.replace(headingNode);
      
      // Move cursor to end of heading
      const newSelection = $createRangeSelection();
      newSelection.anchor.set(headingNode.getKey(), textNode.getTextContentSize(), 'text');
      newSelection.focus.set(headingNode.getKey(), textNode.getTextContentSize(), 'text');
      $setSelection(newSelection);
    });
    
    return true;
  }

  // Check for blockquote pattern (> Quote)
  const blockquoteMatch = text.match(AUTO_FORMAT_PATTERNS.blockquote);
  if (blockquoteMatch) {
    const [, content] = blockquoteMatch;
    
    editor.update(() => {
      const parent = node.getParent();
      if (!$isElementNode(parent)) return;

      // Create new quote node
      const quoteNode = $createQuoteNode();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(content);
      paragraphNode.append(textNode);
      quoteNode.append(paragraphNode);

      // Replace the paragraph with quote
      parent.replace(quoteNode);
      
      // Move cursor to end of quote
      const newSelection = $createRangeSelection();
      newSelection.anchor.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      newSelection.focus.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      $setSelection(newSelection);
    });
    
    return true;
  }

  // Check for unordered list pattern (- Item)
  const unorderedListMatch = text.match(AUTO_FORMAT_PATTERNS.unorderedList);
  if (unorderedListMatch) {
    const [, content] = unorderedListMatch;
    
    editor.update(() => {
      const parent = node.getParent();
      if (!$isElementNode(parent)) return;

      // Create new list
      const listNode = $createListNode('bullet');
      const listItemNode = $createListItemNode();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(content);
      paragraphNode.append(textNode);
      listItemNode.append(paragraphNode);
      listNode.append(listItemNode);

      // Replace the paragraph with list
      parent.replace(listNode);
      
      // Move cursor to end of list item
      const newSelection = $createRangeSelection();
      newSelection.anchor.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      newSelection.focus.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      $setSelection(newSelection);
    });
    
    return true;
  }

  // Check for ordered list pattern (1. Item)
  const orderedListMatch = text.match(AUTO_FORMAT_PATTERNS.orderedList);
  if (orderedListMatch) {
    const [, , content] = orderedListMatch;
    
    editor.update(() => {
      const parent = node.getParent();
      if (!$isElementNode(parent)) return;

      // Create new ordered list
      const listNode = $createListNode('number');
      const listItemNode = $createListItemNode();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(content);
      paragraphNode.append(textNode);
      listItemNode.append(paragraphNode);
      listNode.append(listItemNode);

      // Replace the paragraph with list
      parent.replace(listNode);
      
      // Move cursor to end of list item
      const newSelection = $createRangeSelection();
      newSelection.anchor.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      newSelection.focus.set(paragraphNode.getKey(), textNode.getTextContentSize(), 'text');
      $setSelection(newSelection);
    });
    
    return true;
  }

  return false;
}

export function AutoFormattingPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Handle space key for auto-formatting
    const removeSpaceListener = editor.registerCommand(
      KEY_SPACE_COMMAND,
      (_event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        if (!$isTextNode(anchorNode)) return false;

        const text = anchorNode.getTextContent();
        const nodeKey = anchorNode.getKey();

        // Only trigger if we're at the end of the text and it matches a pattern
        if (selection.anchor.offset === text.length && text.length > 0) {
          return handleAutoFormatting(editor, text, nodeKey);
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    // Handle enter key for auto-formatting
    const removeEnterListener = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (_event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        if (!$isTextNode(anchorNode)) return false;

        const text = anchorNode.getTextContent();
        const nodeKey = anchorNode.getKey();

        // Only trigger if we're at the end of the text and it matches a pattern
        if (selection.anchor.offset === text.length && text.length > 0) {
          return handleAutoFormatting(editor, text, nodeKey);
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeSpaceListener();
      removeEnterListener();
    };
  }, [editor]);

  return null;
}
