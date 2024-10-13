import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure the path to your dbConnect is correct
import MoistureModel from '@/models/Moisture'; // Ensure the path to your Moisture model is correct

// Handle GET requests
export async function GET(req: NextRequest) {
  try {
    // Ensure db connection
    await dbConnect();

    // Check if moisture query parameter is provided for saving
    const { searchParams } = new URL(req.url);
    const moisture = searchParams.get('moisture');

    // If moisture parameter is present, save it
    if (moisture) {
      // Ensure moisture content is provided
      if (!moisture) {
        return NextResponse.json(
          { success: false, message: 'Moisture content is required' },
          { status: 400 }
        );
      }

      // Create a new moisture entry with the current timestamp
      const moistureData = await MoistureModel.create({
        moisture: Number(moisture),
        timestamp: new Date(),
      });

      return NextResponse.json(
        { success: true, data: moistureData },
        { status: 201 }
      );
    } else {
      // If moisture parameter is not provided, retrieve all moisture data
      const moistureData = await MoistureModel.find({});
      return NextResponse.json(
        { success: true, data: moistureData },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error handling moisture data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
