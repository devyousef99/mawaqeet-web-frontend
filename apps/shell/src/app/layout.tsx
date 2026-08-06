import type { Metadata } from "next";
import "@mawaqeet/ui/globals.css";
import { ThemeProvider } from "@mawaqeet/ui/theme";
import { PrefsScript } from "@mawaqeet/ui/PrefsScript";

export const metadata: Metadata = {
  title: "Mawaqeet",
  description: "Appointments, services and subscriptions management platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head><PrefsScript /></head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
