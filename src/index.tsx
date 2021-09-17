import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Index from "./containers/auth";
import App from "./containers/App";
import { store } from "./containers/store";
import "./global.scss";

ReactDOM.render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById("root")
);
