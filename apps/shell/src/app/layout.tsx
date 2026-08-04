import type { Metadata } from "next";
import "@mawaqeet/ui/globals.css";
import { ThemeProvider } from "@mawaqeet/ui/theme";

export const metadata: Metadata = {
  title: "Mawaqeet",
  description: "Appointments, services and subscriptions management platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
