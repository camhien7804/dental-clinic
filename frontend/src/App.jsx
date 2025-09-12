// src/App.jsx
import { Routes } from "react-router-dom";
import { publicRoutes } from "./routes_manager/publicRoutes";
import { privateRoutes } from "./routes_manager/privateRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Suspense } from "react";
import "./index.css";
import Chatbot from "./components/Chatbot";
import BackToTopButton from "./components/BackToTopButton";

function App() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div>Đang tải...</div>}>
          <Routes>
            {publicRoutes}
            {privateRoutes}
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
      <BackToTopButton />
    </>
  );
}

console.log("VITE_API_BASE:", import.meta.env.VITE_API_BASE);

export default App;
