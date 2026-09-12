import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Mistake Reported by User]:', body);

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank! Thank you for helping us improve DeutschReady. Your feedback has been recorded.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record report' }, { status: 500 });
  }
}
