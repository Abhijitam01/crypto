import type React from "react"
import "./globals.css"
import { WalletProvider } from "@/hooks/use-wallet"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  generator: "v0.dev",
}



import './globals.css'