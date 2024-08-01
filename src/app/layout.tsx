import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/layout";
import Providers from "@/providers";
import ToastProvider from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Solana Fellowship - rkmonarch",
  description: "This repo is created for the Solana Fellowship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
