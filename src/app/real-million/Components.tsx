"use client";

import { block } from "million/react";

import React from "react";

export function MillionTest() {
  const [name, setName] = React.useState("Gab");
  return (
    <div className="p-5">
      <input
        className="bg-slate-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Greeting name={name} child={<Tick />} />
    </div>
  );
}

const Tick = () => {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className="p-5">Tick: {tick}</div>;
};

const Greeting = block(
  ({ name, child }: { name: string; child: React.ReactNode }) => {
    console.log(name); // { $: "name" }
    console.log(child); // { $: "child" }

    return (
      <div className="p-10">
        {/* this will render [Object object]! */}
        <p>Hi, {`${name}!`}</p>
        {child}
      </div>
    );
  }
);
