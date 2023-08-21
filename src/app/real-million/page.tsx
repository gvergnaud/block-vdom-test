import { block } from "million/react";
import { MillionTest as ClientMillionTest } from "./Components";

export default function RealMillion() {
  return (
    <>
      <ClientMillionTest />
      {/* <ServerGreeting name="Server" /> */}
    </>
  );
}

/**
 * Calling block throws, because we are on the server and million
 * can only render client side.
 */
// const ServerGreeting = block(({ name }: { name: string }) => {
//   console.log(name); // { $: "name" }

//   return (
//     <div className="p-10">
//       <p>My name is name!</p>
//     </div>
//   );
// });
