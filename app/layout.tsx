import type { Metadata } from "next";
import "./globals.css";
import { saira } from "@/lib/fonts";
import { AuthProvider } from "./contexts/AuthContext";

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
    <html>
      <body className={`${saira.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
