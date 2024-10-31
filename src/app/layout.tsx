"use client";

import { Providers } from "./providers";
import "./globals.css";
import { DynaPuff, Itim, M_PLUS_Rounded_1c } from "next/font/google";

const dynaPuff = DynaPuff({
  subsets: ["latin"],
  weight: "500",
  style: "normal",
  display: "swap",
});

const itim = Itim({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
});

const mPlus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <style jsx global>{`
        .dynapuff {
          font-family: ${dynaPuff.style.fontFamily};
        }
        .itim {
          font-family: ${itim.style.fontFamily};
        }
        .mPlus {
          font-family: ${mPlus.style.fontFamily};
        }
      `}</style>
      <body style={{ height: "100vh" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
