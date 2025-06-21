import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
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
      <body className={`${inter.variable} font-sans min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="pb-6">
                {children}
              </div>
            </main>
            <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
              <div className="pb-6">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} Movie Platform.
                </p>
              </div>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
