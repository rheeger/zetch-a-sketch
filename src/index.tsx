import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "normalize.css";
import "./style.css";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function getLibrary(provider: any, connector: any) {
  return new Web3(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
