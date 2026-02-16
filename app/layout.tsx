import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { Navbar } from "../components/Navbar";

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
        <AuthProvider>
          <Navbar />
          <main className="app-main">
            <div className="app-container">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;

