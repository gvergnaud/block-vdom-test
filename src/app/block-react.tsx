import React from "react";
import { Block } from "./block";

// Make Blocks part of ReactNode
declare module "react" {
  interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES {
    block: Block;
  }
}

export const RenderBlock = ({ children: block }: { children: Block }) => {
  const ref = React.useRef(null);

  const blockRef = React.useRef<Block>();

  React.useLayoutEffect(() => {
    if (!blockRef.current) return;
    const start = performance.now();
    blockRef.current.patch(block);
    console.log("Update perf:", performance.now() - start);
  }, [block]);

  React.useLayoutEffect(() => {
    blockRef.current = block;
    const start = performance.now();
    blockRef.current.mount(ref.current!);
    console.log("Mount perf:", performance.now() - start);
  }, []);

  return <div ref={ref} />;
};
