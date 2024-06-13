import type { Metadata } from "next";
import { Exo } from "next/font/google";

import "./globals.css";
import Header from "./components/global/Header";
import { RootLayoutClient } from "./RootLayoutContext";
import 'react-tooltip/dist/react-tooltip.css';

const inter = Exo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${inter.className} background`}>
      <Header />
      <RootLayoutClient>
        <div className="pt-0 px-16">
          {children}
        </div>
      </RootLayoutClient>
    </body>
  </html>
  );
}
