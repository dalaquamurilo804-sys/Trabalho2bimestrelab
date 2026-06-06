import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./views/about";
import AuthScreen from "./views/auth";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/auth" element={<AuthScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
