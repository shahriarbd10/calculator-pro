import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Calculator Pro",
  description: "Modern Next.js calculator with assistive and predictive modes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
