import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Questrial } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const questrial = Questrial({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-questrial',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Data Visualiser",
  description: "Visualise your data easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${questrial.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
