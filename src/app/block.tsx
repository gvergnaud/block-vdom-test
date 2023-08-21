type Props = Record<string, VNode | VNode[]>;

export type BlockProps<K extends string = string> = Record<
  K,
  string | number | Block
>;

export type VElement = {
  type: string;
  props: Props;
};

export type VNode = VElement | string | number;

export const h = (
  type: string,
  props: Props = {},
  ...children: VNode[]
): VElement => ({
  type,
  props: { children, ...props },
});

class Hole {
  constructor(public key: string) {}
}

export type Block = {
  mount: (parent: Node) => void;
  patch: (block: Block) => void;
  props: BlockProps;
  edits: Edit[];
};

// `block` turns a component into a block.
export const block = <P extends BlockProps>(fn: (props: P) => VNode) => {
  return (props: P): Block => {
    // The main idea of block vdom is to findout
    // which props mapps to which node in the VTree.
    // We do that thanks to a props proxy returning
    // a "Hole" instance:

    const propsProxy = new Proxy(
      {},
      {
        get: (_target, key: string) => {
          return new Hole(key);
        },
      }
    );

    // A store of DOM elements for each edit
    let elements: Node[] = [];
    const edits: Edit[] = [];

    const mount = (parent: Node) => {
      // We call the component using a proxy instead of props.
      // How doesn't that throw?? 🤔
      // [EDIT] it does throw if you do more than just
      // interpolating props.
      const vnode = fn(propsProxy as P);
      // vnode contains Holes.

      const root = render(vnode, edits);

      const rootClone = root.cloneNode(true);

      parent.textContent = "";
      parent.appendChild(rootClone);

      edits.forEach((edit, index) => {
        const value = props[edit.propName];
        const el = getElFromPath(rootClone, edit.path);
        elements[index] = el;

        if (edit.type === "attribute") {
          // @ts-ignore
          el[edit.attributeName] = value;
        } else if (edit.type === "child") {
          if (isBlock(value)) {
            // If it's a child block, mount it.
            // Use a fragment element
            // to avoid overriding the existing children of el.
            const frag = document.createDocumentFragment();
            value.mount(frag);
            el.insertBefore(frag, el.childNodes[edit.index]);
            return;
          }

          // @ts-ignore
          const textNode = document.createTextNode(value);
          el.insertBefore(textNode, el.childNodes[edit.index]);
        }
      });
    };

    const patch = (newBlock: Block) => {
      edits.forEach((edit, index) => {
        const prevValue = props[edit.propName];
        const newValue = newBlock.props[edit.propName];

        if (prevValue == newValue) return;

        const el = elements[index];
        if (edit.type === "attribute") {
          // @ts-ignore
          el[edit.propName] = newValue;
        } else if (edit.type === "child") {
          if (isBlock(newValue) && isBlock(prevValue)) {
            prevValue.patch(newValue);
            return;
          }

          if (isBlock(newValue)) {
            newValue.mount(el.childNodes[edit.index]);
            return;
          }

          el.childNodes[edit.index].textContent = newValue.toString();
        }
      });
    };

    return { mount, patch, props, edits };
  };
};

/**
 * Render does two things:
 * - it turns a VNode into html
 * - it records "edits". these are a list of mappings between
 *   between a prop key, and a position on the dom.
 */

type Edit =
  | {
      type: "attribute";
      path: number[];
      attributeName: string;
      propName: string;
    }
  | {
      type: "child";
      path: number[];
      index: number;
      propName: string;
    };

const render = (
  vnode: VNode,
  edits: Edit[],
  path: number[] = []
): HTMLElement | Text => {
  if (typeof vnode === "string" || typeof vnode === "number")
    return document.createTextNode(vnode.toString());

  const el = document.createElement(vnode.type);

  for (const [key, value] of Object.entries(vnode.props)) {
    if (key === "children") continue;

    if (value instanceof Hole) {
      edits.push({
        type: "attribute",
        attributeName: key,
        path,
        propName: value.key,
      });
      continue;
    } else {
      // @ts-ignore
      el[key] = value;
    }
  }

  const childrenArray = Array.isArray(vnode.props.children)
    ? vnode.props.children
    : vnode.props.children
    ? [vnode.props.children]
    : [];

  for (const [index, child] of childrenArray.entries()) {
    if (child instanceof Hole) {
      edits.push({
        type: "child",
        propName: child.key,
        index,
        path,
      });
      continue;
    } else {
      el.appendChild(render(child, edits, path.concat(index)));
    }
  }

  return el;
};

const getElFromPath = (el: Node, path: number[]): Node => {
  return !path.length
    ? el
    : getElFromPath(el.childNodes[path[0]], path.slice(1));
};

const isBlock = (value: unknown): value is Block =>
  !!value &&
  typeof value === "object" &&
  "mount" in value &&
  typeof value.mount === "function" &&
  "patch" in value &&
  typeof value.patch === "function" &&
  "props" in value &&
  "edits" in value &&
  Array.isArray(value.edits);
