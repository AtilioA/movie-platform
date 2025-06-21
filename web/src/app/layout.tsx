import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Container from "@/components/ui/container";
import { AppProvider } from "@/providers/app-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-gray-50 dark:bg-gray-900`}>
        <AppProvider>
          <div className="flex flex-col">
            <Header />
            <main className="flex-1">
              <Container>
                {children}
              </Container>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
