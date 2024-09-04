import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Workspace from "./components/Workspace/Workspace.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <div>
        <Toaster position="top-center"/>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<Workspace />} />
      </Routes>
    </>
  );
};

export default App;
