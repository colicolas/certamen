import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Providers from "./providers";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS manually
import { config } from '@fortawesome/fontawesome-svg-core';
import { SpeedInsights } from "@vercel/speed-insights/next"
config.autoAddCss = false; // Prevent Font Awesome from adding its CSS again

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
        <head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

          <meta property="og:title" content="certamen."/>
          <meta property="og:description" content="discite lucendo :)"/>
          <meta property="og:url" content="https://certamen.vercel.app/"/>
          <meta property="og:type" content="website"/>

          <meta property="og:site_name" content="certamen."/>
          <meta property="og:image:width" content="1200"/>
          <meta property="og:image:height" content="630"/>
        </head>

        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}
