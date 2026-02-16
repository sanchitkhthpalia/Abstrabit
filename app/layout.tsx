import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { ThemeProvider } from "../lib/theme-context";
import { Navbar } from "../components/Navbar";
import { ToasterProvider } from "../components/ToasterProvider";

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description: "Private realtime bookmarks with Firebase and Next.js"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className="h-full">
      <body className="app-shell">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="app-main">
              <div className="app-container">{children}</div>
            </main>
            <ToasterProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

