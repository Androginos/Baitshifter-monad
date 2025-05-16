import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    accountAssociation: {
      header: "eyJmaWQiOjQ5OTYzMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDg0OWFFNzY0N2VmMDMxMTMxQzUzMmNDNzc5NzJBREZDODI2N0I2ZGQifQ",
      payload: "eyJkb21haW4iOiJiYWl0c2hpZnRlci1tb25hZC52ZXJjZWwuYXBwIn0",
      signature: "MHgyNmI3M2FlN2FlYmU3MTVmM2ZjYzdkODhjNmI1OTBmNjczZDIyMGJlYWM5MGIxZDAwNDE1OWM4ZTk1M2FhY2JhNGVjN2IwY2Q1YmRkNzViMzc3Y2VmNjY5NzFmYjNiN2QwMzY5NjBiOThmYWY4Y2Y1NjhmNzI2MjVjMTliNmI5NjFj"
    },
    frame: {
      version: "1",
      name: "Baitshifters",
      iconUrl: "https://baitshifter-monad.vercel.app/images/icon.png",
      homeUrl: "https://baitshifter-monad.vercel.app",
      imageUrl: "https://baitshifter-monad.vercel.app/images/feed.png",
      screenshotUrls: [],
      tags: ["monad", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Play Baitshifters",
      splashImageUrl: "https://baitshifter-monad.vercel.app/images/splash.png",
      splashBackgroundColor: "#ffffff",
      webhookUrl: "https://baitshifter-monad.vercel.app/api/webhook",
    },
  };

  return NextResponse.json(farcasterConfig);
}
