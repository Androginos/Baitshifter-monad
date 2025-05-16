"use client";
import App from "@/components/pages/app";
import { sdk } from '@farcaster/frame-sdk';

export default function Home() {
  const handleAddFrame = async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      console.error('Error adding frame:', error);
    }
  };
  return (
    <div>
      <App />
      <button onClick={handleAddFrame}>Add Frame</button>
    </div>
  );
}
