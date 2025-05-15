"use client";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import abi from "@/contracts/BaitshiftersABI.json";
import { useEffect } from "react";

export function WalletActions() {
  const context = useMiniAppContext();
  const { isEthProviderAvailable } = context;
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();

  // Contract write hook
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Oyun başladığında default chain Monad Testnet olsun
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id });
    }
  }, [isConnected, chainId, switchChain]);

  async function sendTransactionHandler() {
    if (!context.context) return;

    const user = context.context.user;
    const displayName = user.displayName || "";
    const username = user.username || "";
    const fid = Number(user.fid);
    const score = Math.floor(Math.random() * 9900) + 100;

    writeContract({
      address: "0x0fbb981599fb6b1018bae5488838101f4f5fd3c5",
      abi,
      functionName: "submitScore",
      args: [displayName, username, fid, score],
      chainId: monadTestnet.id,
    });
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left" style={{ color: '#FBFAF9' }}>Connected Wallet</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {isConnected ? (
          <div className="flex flex-col space-y-4 justify-start">
            <p className="text-sm text-left" style={{ color: '#FBFAF9', fontWeight: 'bold' }}>
              Connected to wallet:{" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]" style={{ background: 'rgba(32,0,82,0.95)', color: '#fff' }}>
                {address}
              </span>
            </p>
            <p className="text-sm text-left" style={{ color: '#FBFAF9', fontWeight: 'bold' }}>
              Chain Id:{" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]" style={{ background: 'rgba(32,0,82,0.95)', color: '#fff' }}>
                {chainId}
              </span>
            </p>
            {chainId === monadTestnet.id ? (
              <></>
            ) : (
              <button
                className="rounded-md p-2 text-sm font-bold w-full"
                style={{ background: 'rgba(32,0,82,0.85)', color: '#fff' }}
                onClick={() => switchChain({ chainId: monadTestnet.id })}
              >
                Switch to Monad Testnet
              </button>
            )}

            <button
              className="rounded-md p-2 text-sm font-bold w-full"
              style={{ background: 'rgba(32,0,82,0.85)', color: '#fff' }}
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          isEthProviderAvailable ?
          (
            <button
              className="rounded-md p-2 text-sm font-bold w-full"
              style={{ background: 'rgba(32,0,82,0.85)', color: '#fff' }}
              onClick={() => connect({ connector: farcasterFrame() })}
            >
              Connect Wallet
            </button>
          ) :
          (
            <p className="text-sm text-left">
              Wallet connection only via Warpcast
            </p>
          )
        )}
      </div>
    </div>
  );
}
