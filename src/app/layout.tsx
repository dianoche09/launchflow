import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchFlow | Absolute Distribution Engine",
  description: "Submit to 100+ platforms in a single deployment cycle.",
  openGraph: {
    title: "LaunchFlow | Absolute Distribution Engine",
    description: "Submit to 100+ platforms in a single deployment cycle.",
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
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
