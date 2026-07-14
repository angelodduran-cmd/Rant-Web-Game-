import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(60, 36, 17, 0.9)",
            backdropFilter: "blur(12px)",
            color: "#FEF3C7",
            border: "1px solid #78350F",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#FCD34D",
              secondary: "#78350F",
            },
          },
          error: {
            iconTheme: {
              primary: "#F87171",
              secondary: "#78350F",
            },
          },
          loading: {
            iconTheme: {
              primary: "#FCD34D",
              secondary: "#78350F",
            },
          },
        }}
      />
    </>
  );
}

export default App;
