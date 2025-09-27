
import { HeadingNode } from '@lexical/rich-text';
import { QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';

export function createAutoFormattingPlugin() {
  return {
    name: 'AutoFormatting',
    initialize: () => {
      // This will be implemented as a plugin
    }
  };
}

export class PustacHeadingNode extends HeadingNode {
  static getType(): string {
    return 'pustac-heading';
  }

  static clone(node: PustacHeadingNode): PustacHeadingNode {
    return new PustacHeadingNode(node.getTag());
  }

  createDOM(): HTMLElement {
    const tag = this.getTag();
    const element = document.createElement(tag);
    element.className = `pustac-${tag}`;
    return element;
  }

  updateDOM(prevNode: PustacHeadingNode, dom: HTMLElement): boolean {
    if (prevNode.getTag() !== this.getTag()) {
      const newElement = this.createDOM();
      dom.parentNode?.replaceChild(newElement, dom);
      return true;
    }
    return false;
  }
}

export class PustacQuoteNode extends QuoteNode {
  static getType(): string {
    return 'pustac-quote';
  }

  static clone(_node: PustacQuoteNode): PustacQuoteNode {
    return new PustacQuoteNode();
  }

  createDOM(): HTMLElement {
    const element = document.createElement('blockquote');
    element.className = 'pustac-quote';
    return element;
  }
}

export class PustacListNode extends ListNode {
  static getType(): string {
    return 'pustac-list';
  }

  static clone(node: PustacListNode): PustacListNode {
    return new PustacListNode(node.getListType());
  }

  createDOM(): HTMLElement {
    const element = document.createElement(this.getListType());
    element.className = `pustac-list-${this.getListType()}`;
    return element;
  }
}

export class PustacListItemNode extends ListItemNode {
  static getType(): string {
    return 'pustac-list-item';
  }

  static clone(node: PustacListItemNode): PustacListItemNode {
    return new PustacListItemNode(node.getValue());
  }

  createDOM(): HTMLElement {
    const element = document.createElement('li');
    element.className = 'pustac-listitem';
    return element;
  }
}

// Export all custom nodes
export const customNodes = [
  PustacHeadingNode,
  PustacQuoteNode,
  PustacListNode,
  PustacListItemNode,
];
