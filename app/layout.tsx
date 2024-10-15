import type { Metadata } from "next";
import AppWrapper from "./_lib/application/wrapper/AppWrapper";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getPathname } from "./_lib/util/ssr-url";
import { roboto, notojp } from "./_lib/mui/font";

export const fetchCache = "default-no-store";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL!),
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    default: process.env.NEXT_PUBLIC_APP_NAME!,
  },
  openGraph: {
    images: ["/icon512_maskable.png"],
  },
};

export default async function RootLayout({
  children,
  applayout,
}: Readonly<{
  children: ReactNode;
  applayout: ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#5384f6" />
      </head>
      <body className={`${roboto.className} ${notojp.className}`}>
        <AppWrapper>
          {applayout}
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
