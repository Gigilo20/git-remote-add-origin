import { NextRequest, NextResponse } from 'next/server';

/**
 * პროქსი Claude API-ზე — გასაღები მხოლოდ სერვერზე (Vercel env).
 * კლიენტი იგივე JSON-ს აგზავნის, რასაც Anthropic Messages API ელოდება.
 */
export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: { message: 'ANTHROPIC_API_KEY არ არის დაყენებული Vercel-ზე' } },
      { status: 501 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
