import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaTeX Math Equation Editor",
  description: "Self-hosted LaTeX math equation editor with live preview and export capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
