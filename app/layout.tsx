"use server";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "../assets/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default MainLayout;
