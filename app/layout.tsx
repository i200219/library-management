import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

import localFont from "next/font/local";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/ThemeProvider";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "Library System",
  description: "Library System is a book borrowing university library management solution.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <ThemeProvider defaultTheme="dark" storageKey="library-theme">
          <body className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
            {children}
            <Footer />
            <Toaster />
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
