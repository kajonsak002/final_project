import React from "react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-auto w-full">
      <NavBar />
      <main className="flex-grow w-full mt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
