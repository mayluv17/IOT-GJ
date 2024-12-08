import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure the path to your dbConnect is correct
import MoistureModel from '@/models/Moisture'; // Ensure the path to your Moisture model is correct

export async function GET(req: NextRequest) {
  try {
    // Ensure db connection
    await dbConnect();

    // Extract query parameters directly from the request object (nextUrl is more Next.js-friendly)
    const { searchParams } = req.nextUrl;
    const moistureBefore = searchParams.get('moistureBefore');
    const moistureAfter = searchParams.get('moistureAfter');
    const isIrrigated = searchParams.get('isIrrigated');

    if (!moistureBefore || !moistureAfter || !isIrrigated) {
      return NextResponse.json(
        { success: false, message: 'Moisture content is required' },
        { status: 400 }
      );
    }

    // Create a new moisture record
    const moistureData = await MoistureModel.create({
      moistureBefore: Number(moistureBefore),
      moistureAfter: Number(moistureAfter),
      isIrrigated: Number(isIrrigated),
      timestamp: new Date(),
    });

    return NextResponse.json(
      { success: true, data: moistureData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling moisture data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
