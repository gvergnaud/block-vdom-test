# Thousand

Test repository to better understand the concept of block virtual dom.

```bash
npm run dev

```

## Findings

Block virtual dom doesn't seem generally applicable. It only works when component props are interpolated in a VDOM tree directly, without being modified by the render function in any way.

That's because the `block` function does not pass props to components:

```ts
//                                These types are lies.
//                                         👇
const BlockComp = block(({ a, b }: { a: string; b: number }) => {
  // `a` isn't a `string` but a `Hole`.
  // `b` isn't a `number` but a `Hole`.
});
```

We can't use an effect in a block because we don't have access to real props:

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

Basically, `block` turns all props into signals. Updating this component is essentially instant, but it can't contain conditional logic, or anything interesting. A block is basically a template.
