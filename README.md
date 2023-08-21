# Thousand

Test repository to better understand the concept of block virtual dom.

```bash
npm run dev

```

## Findings

### How it works

Find the full clone implementation [here](https://github.com/gvergnaud/block-vdom-test/blob/main/src/app/block.tsx).

[Million.js](https://million.dev/) exposes a `block` function that wraps a react component:

```ts
const BlockComp = block(Comp);
```

when wrapping a component into `block`, million will inject a Proxy instead of the expected `props` object that always returns a `{ $: string }` object when accessing any key.

```ts
//                                These types are a lie.
//                                         👇
const BlockComp = block(({ a, b }: { a: string; b: number }) => {
  // `a` isn't a `string` but a `{ $: "a" }`.
  // `b` isn't a `number` but a `{ $: "b" }`.
});
```

This means we can't use an effect in a block because we don't have access to real props:

```ts
const BlockComp = block(({ x }: { x: number }) => {
  React.useEffect(() => {
    el.style.transform = `translateX(${x}px)`;
    //                                 ^ ❌
    //              Will be [Object object]
  }, []);
});
```

They can only be pure presentational components:

```tsx
const BlockComp = block(({ name }: { name: string }) => {
  // Works
  return <p>Hello, {name}</p>;
});
```

the `block` then goes through the returned JSX tree to find these `{ $: key }` "hole" objects and store a mapping between DOM elements or attributes and components props:

```ts
const block = (component) => (props) => {
  const vdom = component(props);
  type PropName = string;
  type Edit =
    | { type: "child"; index: number; el: HTMLElement }
    | { type: "attr"; attrName: string; el: HTMLElement };
  const editMap: Map<PropName, Edit> = findThingsToUpdateLater(vdom);
  // ...
```

During the first render, the JSX is turned into dom elements and rendered:

```ts
const domNode = render(vdom);
container.appendChild(domNode);
```

But during updates, we only go through the edit map to update the related dom nodes:

```ts
const update = (newProps) => {
  for (const [propName, edit] of map) {
    const prop = newProps[propName];
    switch (edit.type) {
      case "child": {
        // Update textual content.
        edit.el.childNodes[edit.index].textContent = prop;
        break;
      }
      case "attr": {
        // update attr
        edit.el[edit.attrName] = prop;
        break;
      }
    }
  }
};
```

### Limitations

The main limitation is that a block component can only be a template, that doesn't transform props in any way.

```tsx
//                               Still a lie
//                                    👇
const BlockComp = block(({ x }: { x: number }) => {
  // [Object object]
  return <p>{x + 1}</p>;
});
```

The component can't contain conditional logic either. The DOM content must be static, except for interpolated props.

**Secondly**, creating a block means opting out of the react tree. The JSX defined in a block isn't React, so if you try rendering another React component inside of it, million will call `ReactDOM.createRoot` under the hood and create a new root for this component. That means this component won't be able to access React's Context, and it's unclear how calling `root.render` performs compared to having this component part of the main react tree.

**Thirdly**, `block`s can't be server-side rendered, since they turn JSX into DOM nodes.

### Perf

Basically, `block` turns all props into signals. Updating this component is essentially instant, but it can't contain conditional logic, or anything interesting. A block is just a template.

Block virtual dom isn't generally applicable but might be a good fit for perf-sensitive leaf components that tend to be re-rendered very frequently.
