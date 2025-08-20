import type { Metadata } from "next";
import { Karla, Inter } from "next/font/google";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizzical App",
  description: "Test your knowledge and challenge yourself with fun questions!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#555555"></meta>
      </head>
      <body
        className={`${karla.variable} lg:text-3xl text-[#293264] overflow-x-hidden`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
