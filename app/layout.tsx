import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Kartik Soni — Awwwards Developer Portfolio & 3D Web Architect",
  description:
    "World-class developer portfolio of Kartik Soni, Senior Full Stack Node.js Engineer & UI/UX Architect creating modern WebGL 3D web applications.",
  keywords: [
    "Kartik Soni",
    "Developer Portfolio",
    "Full Stack Developer",
    "Three.js",
    "Next.js",
    "Node.js",
    "UI/UX Designer",
    "Awwwards Portfolio",
  ],
  authors: [{ name: "Kartik Soni" }],
  openGraph: {
    title: "Kartik Soni — World-Class Developer Portfolio",
    description: "Senior Full Stack Node.js Engineer & UI/UX Architect creating modern WebGL 3D web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
