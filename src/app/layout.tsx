import type { Metadata } from "next";
import { Red_Hat_Display, Outfit, Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "300", "200", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Junayet",
  description: "Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
