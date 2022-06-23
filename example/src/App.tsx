import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
// import useSharedState from "react-use-shared-state";
import useSharedState, { usePubState, getSharedState } from "../../src";

function ChildApp() {
  const [count, setCount] = useSharedState<{ value: number }>("countState");

  const [aa, setAA] = useSharedState("aa", 3);
  const [setAAA] = usePubState("aaa");
  const aaaa = getSharedState("aaaa");

  const [bb, setBB] = useSharedState<number | null>("bb");
  const [setBBB] = usePubState<number>("bbb");
  const bbbb = getSharedState<string>("bbbb");

  return (
    <p>
      <button
        type="button"
        onClick={() => setCount({ value: count!.value + 1 })}
      >
        count is: {count?.value}
      </button>
    </p>
  );
}

function App() {
  const [count, setCount] = useSharedState("countState", { value: 0 });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button
            type="button"
            onClick={() => setCount({ value: count!.value + 1 })}
          >
            count is: {count?.value}
          </button>
        </p>
        <ChildApp />
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
