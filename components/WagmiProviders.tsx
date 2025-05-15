"use client";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";
import { ReactNode } from "react";

export default function WagmiProviders({ children }: { children: ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
} 