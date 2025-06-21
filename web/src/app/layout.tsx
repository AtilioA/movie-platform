import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AppProvider } from "@/providers/app-provider";
import Container from "@/components/ui/container";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movie Platform",
  description: "Discover and explore movies and actors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <QueryProvider>
          <AppProvider>
            <Header />
            <main className="flex-1">
              <Container>{children}</Container>
            </main>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
