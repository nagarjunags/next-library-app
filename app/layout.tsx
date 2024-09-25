"use client"; // Keep this if you are using client-side features

import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "../assets/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";
import Head from "next/head"; // Import Head from next/head

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        />
      </Head>
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
