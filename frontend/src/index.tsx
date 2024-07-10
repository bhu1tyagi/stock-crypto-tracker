import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement; 

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement
);
