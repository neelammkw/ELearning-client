"use client";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import { useEffect, useState } from "react";
// require("dotenv").config();

// import ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
// import socketId = socketIO(ENDPOINT, { transports: ["websocket"]})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    setMounted(true);
    // socketId.on("connection", () => {});
  }, []);

  // Return loader on server and during initial hydration
  if (typeof window === "undefined" || isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};
