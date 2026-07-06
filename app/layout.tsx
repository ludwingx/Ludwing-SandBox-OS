import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ludwing Sandbox OS — Interactive Desktop",
  description:
    "An interactive Windows 2000-style virtual desktop showcasing Ludwing's software projects. Explore demos of LaMovidaBO, Market GS, Mary Jane AI, and PhronAgents in floating windows.",
  keywords: [
    "Ludwing",
    "portfolio",
    "sandbox",
    "virtual desktop",
    "Windows 2000",
    "interactive demo",
    "full stack developer",
  ],
  authors: [{ name: "Ludwing" }],
  openGraph: {
    title: "Ludwing Sandbox OS",
    description:
      "Explore interactive demos of software projects in a retro Windows 2000 virtual desktop.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
