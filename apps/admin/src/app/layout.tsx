import type { Metadata } from "next";
import "@mawaqeet/ui/globals.css";
import { ThemeProvider } from "@mawaqeet/ui/theme";

export const metadata: Metadata = {
  title: "Mawaqeet — Admin",
  description: "System administration: providers, users, subscriptions and platform reports",
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
