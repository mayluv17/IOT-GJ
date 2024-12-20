import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure the path to your dbConnect is correct
import MoistureModel from '@/models/Moisture'; // Ensure the path to your Moisture model is correct
import { revalidatePath } from 'next/cache';

export async function GET() {
  revalidatePath('/');

  try {
    // Ensure db connection
    await dbConnect();

    // Fetch moisture data
    const moistureData = await MoistureModel.find({});

    // Return response with no-cache headers
    return NextResponse.json(
      { success: true, data: moistureData },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store', // Prevent any caching
          Pragma: 'no-cache',
          Expires: '0', // Ensure expiration is set to 0 to prevent caching
        },
      }
    );
  } catch (error) {
    console.error('Error handling moisture data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
