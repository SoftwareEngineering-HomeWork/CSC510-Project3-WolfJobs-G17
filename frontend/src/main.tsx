import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// import MenuProvider from "./context/MenuProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <MenuProvider> */}
        <App/>
      {/* </MenuProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
