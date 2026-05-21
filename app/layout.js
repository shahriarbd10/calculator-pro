import "./globals.css";

export const metadata = {
  title: "Smart Calculator Pro",
  description: "Modern Next.js calculator with assistive and predictive modes"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
