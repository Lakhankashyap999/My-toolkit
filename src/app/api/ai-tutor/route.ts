import { NextRequest, NextResponse } from 'next/server';
import { DoubtRequest } from '@/types';
import { generateProgressiveDoubtExplanation } from '@/lib/aiEngine';

export async function POST(req: NextRequest) {
  try {
    const body: DoubtRequest = await req.json();

    if (!body.topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Call the progressive pedagogical ladder
    const response = generateProgressiveDoubtExplanation({
      topic: body.topic,
      contextGerman: body.contextGerman,
      userQuestion: body.userQuestion,
      userAnswer: body.userAnswer,
      correctAnswer: body.correctAnswer,
      currentLevel: body.currentLevel || 1,
      language: body.language || 'hinglish'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/ai-tutor:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation. Please try again.' },
      { status: 500 }
    );
  }
}
