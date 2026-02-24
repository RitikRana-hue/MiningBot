import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Forward request to Python backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const backendResponse = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend responded with status: ${backendResponse.status}`);
      }

      const data = await backendResponse.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.error('Backend error:', backendError);

      // Fallback response if backend is unavailable
      return NextResponse.json({
        response: "I'm having trouble connecting to my mining knowledge base. Please try again in a moment. The backend AI system might be starting up.",
        success: false,
        error: "Backend unavailable"
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
