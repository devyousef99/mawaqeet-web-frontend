import type { Metadata } from "next";
import "@mawaqeet/ui/globals.css";
import { ThemeProvider } from "@mawaqeet/ui/theme";
import { PrefsScript } from "@mawaqeet/ui/PrefsScript";

export const metadata: Metadata = {
  title: "Mawaqeet — Provider",
  description: "Branch dashboard: appointments, services, employees and promotions",
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
