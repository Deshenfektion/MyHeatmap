import type { Metadata } from "next";
import "./globals.css";
import { saira } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "MyHeatmap",
  description: "Minimalistic Heatmap",
  icons: {
    icon: "favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${saira.className} antialiased`}>{children}</body>
    </html>
  );
}
