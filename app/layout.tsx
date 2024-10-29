import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

// Keep metadata at the top level
export const metadata: Metadata = {
  title: "Telemedicine Portal",
  description: "A telemedicine platform for healthcare providers",
};

// Keep the main layout component as a server component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
