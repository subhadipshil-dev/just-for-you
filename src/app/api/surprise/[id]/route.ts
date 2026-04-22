import { NextRequest, NextResponse } from 'next/server';
import { getSurprise } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surprise = getSurprise(id);

    if (!surprise) {
      return NextResponse.json(
        { error: 'Surprise not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json(surprise);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surprise' },
      { status: 500 }
    );
  }
}
