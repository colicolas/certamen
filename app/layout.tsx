import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Providers from "./providers";

export const metadata: Metadata = {
  title: "certamen.",
  description: "lucendo discimus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <Providers>
          <body className={inter.className}>{children}</body>
        </Providers>
      </html>
    </>
  );
}
