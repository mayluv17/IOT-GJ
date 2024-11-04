import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure the path to your dbConnect is correct
import MoistureModel from '@/models/Moisture'; // Ensure the path to your Moisture model is correct

export async function GET(req: NextRequest) {
  try {
    // Ensure db connection
    await dbConnect();

      const moistureData = await MoistureModel.find({});
      return NextResponse.json(
        { success: true, data: moistureData },
        { status: 200 }
      );
    
  } catch (error) {
    console.error('Error handling moisture data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
    
  }
}
