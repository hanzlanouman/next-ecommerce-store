import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@components/navbar";
import Notification from "./components/Notification";
import AuthSession from "./components/AuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pro Store | Ecommerce Store",
  description: "Your one stop shop for all your ecommerce needs",
  icons: [
    {
      rel: "icon",
      url: "/cat.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/cat.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSession>
      <html lang="en">
        <body className={inter.className}>

          {children}
          <Notification />
        </body>

      </html>
    </AuthSession>
  );
}
