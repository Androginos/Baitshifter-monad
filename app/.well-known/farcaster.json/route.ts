import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    frame: {
      version: "1",
      name: "Baitshifters",
      iconUrl: `${APP_URL}/images/logo.png`,
      homeUrl: `${APP_URL}/game`,
      splashImageUrl: `${APP_URL}/images/logo.png`,
      splashBackgroundColor: "#200052",
      subtitle: "Test your brain power with Monad knowledge!",
      description: "Join a fun and fast-paced quiz with Baitshifters.",
      primaryCategory: "games",
      tags: ["game", "monad", "quiz", "farcaster"],
      tagline: "Test your brain power with Monad knowledge!",
      ogTitle: "Baitshifters",
      ogDescription: "Join a fun and fast-paced quiz with Baitshifters.",
      ogImageUrl: `${APP_URL}/images/og.png`
    }
  };

  return NextResponse.json(farcasterConfig);
}
