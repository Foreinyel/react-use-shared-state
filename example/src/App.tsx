import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
// import useSharedState from "react-use-shared-state";
import useSharedState from "../../src";

function ChildApp() {
  const [count, setCount] = useSharedState("countState");
  return (
    <p>
      <button type="button" onClick={() => setCount(count + 1)}>
        count is: {count}
      </button>
    </p>
  );
}

function App() {
  const [count, setCount] = useSharedState("countState", 0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount(count + 1)}>
            count is: {count}
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
