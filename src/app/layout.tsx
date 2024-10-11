import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/AppCustomComponents/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Providers from "./providers";
import ContractContectProvider from "@/Context/contractContect";
import { ToastProvider } from "@/components/ui/toast";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <ContractContectProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
          >
            <Providers>
              <ToastProvider>
                <Navbar />
                {children}
              </ToastProvider>
            </Providers>
          </ThemeProvider>
        </body>
      </ContractContectProvider>
    </html>
  );
}
