import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveSurprise } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { receiverName, senderName, customMessage, theme, mode, experienceType } = body;

    if (!receiverName) {
      return NextResponse.json(
        { error: 'Receiver name is required' },
        { status: 400 }
      );
    }

    const shortId = nanoid(8);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const surpriseData = {
      shortId,
      receiverName,
      senderName,
      customMessage,
      theme: theme || 'cute',
      mode: mode || 'default',
      experienceType: experienceType || 'fun',
      expiresAt,
    };

    // Save to in-memory storage
    saveSurprise(surpriseData);

    return NextResponse.json({
      success: true,
      shortId: shortId,
      url: `/s/${shortId}`,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
