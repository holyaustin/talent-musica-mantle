import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import "./index.css";
import Explore from "./pages/explore";
import Create from "./pages/create";
import Live from "./pages/live";
import Watch from "./pages/watch";

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      serverUrl="https://hpz4yq50hr8y.usemoralis.com:2053/server"
      appId="FaLY0U96izeaTHPkmvxHUq87YIejSYU0KMBiHS5M"
    >

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="explore" element={<Explore />} />
          <Route path="live" element={<Live />} />
          <Route path="create" element={<Create />} />
          <Route path="watch" element={<Watch />} />
        </Routes>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
