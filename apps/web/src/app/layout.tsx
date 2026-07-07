import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator AI Studio",
  description: "AI content studio for vertical media brands."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
