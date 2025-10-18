import Ably from "ably";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ABLY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ABLY_API_KEY not configured. Please add it to your .env.local file.",
        },
        { status: 500 },
      );
    }

    // Get clientId from query params or use a default
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") || `user-${Date.now()}`;

    const client = new Ably.Rest(apiKey);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: clientId,
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error("Error creating token request:", error);
    return NextResponse.json(
      { error: "Failed to create token request" },
      { status: 500 },
    );
  }
}
