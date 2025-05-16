import App from "@/components/pages/app";
import { sdk } from '@farcaster/frame-sdk';
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Baitshifters",
  description: "Play Baitshifters Mini App on Farcaster!",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://baitshifter-monad.vercel.app/images/feed.png",
      button: {
        title: "Play Baitshifters",
        action: {
          type: "launch_frame",
          name: "Baitshifters",
          url: "https://baitshifter-monad.vercel.app",
          splashImageUrl: "https://baitshifter-monad.vercel.app/images/splash.png",
          splashBackgroundColor: "#ffffff"
        }
      }
    })
  }
};
