"use client";
import React from "react";
import { Greeting } from "./BlockComponents";

export default function HomePage() {
  const [name, setName] = React.useState("Gab");

  return (
    <div className="p-10">
      <input
        className="p-5 bg-slate-600"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Greeting name={name}></Greeting>
      <Greeting name={name}></Greeting>
      <Greeting name={name}></Greeting>
      <Greeting name={name}></Greeting>
    </div>
  );
}
