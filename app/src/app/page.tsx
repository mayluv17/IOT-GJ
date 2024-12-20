'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Progress } from 'react-circle-progress-bar';

import Image from 'next/image';
import { formatRelative } from 'date-fns';

import { ResponsiveLine } from '@nivo/line';

const fetchMoistureData = async () => {
  const timestamp = Date.now();

  const response = await axios.get(`/api/getmoisture?t=${timestamp}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
  return response.data.data; // Assuming the data is in the 'data' field
};

const progressStyles = {};

const isMoreThan3DaysAgo = (timestamp: string): boolean => {
  const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  const givenTimestamp = new Date(timestamp).getTime();
  const currentTimestamp = Date.now();

  return currentTimestamp - givenTimestamp > threeDaysInMilliseconds;
};

export default function Home() {
  const getMoistureQuery = {
    queryKey: ['moisture'],
    queryFn: () => fetchMoistureData(),
    cacheTime: 0, // Don't cache the data, always refetch it
    staleTime: 0,
  };

  const { data, isLoading, error } = useQuery(getMoistureQuery);

  const graphData = !isLoading &&
    !error && [
      {
        id: 'mostureGraph',
        color: 'hsl(184, 70%, 50%)',
        data: data.map(({ timestamp, moistureAfter }) => ({
          // "x": format(timestamp, "dd/MM/yyyy,H:mm"),
          x: timestamp,
          y: moistureAfter,
        })),
      },
    ];

  return (
    <>
      <p className="p-4 pl-8 bold font-bold text-xl text-blue-600">
        Plantly
        <small className="text-slate-600 text-xs ml-1 font-thin">
          Dashboard
        </small>
      </p>
      <hr />
      <div className="m-8 max-w-[690px] mx-auto p-2 flex flex-wrap gap-8 font-[family-name:var(--font-geist-sans)] ">
        {isLoading && <p className="m-auto">Loading...</p>}
        {error && (
          <p className="m-auto text-red-600 text-center">
            There was an error<i>please refresh</i>
          </p>
        )}
        {!isLoading && !error && data && (
          <div className="border-2 mx-auto border-slate-300 p-2 rounded-lg text-center">
            <h4 className="bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mx-auto">
              Moisture Before
            </h4>
            <Progress
              reduction={0}
              transitionDuration={0.5}
              transitionTimingFunction={'ease'}
              gradient={[
                { stop: 0.0, color: '#00bc9b' },
                { stop: 1, color: '#5eaefd' },
              ]}
              style={progressStyles}
              progress={data.at(-1).moistureBefore}
            />
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="border-2 mx-auto border-slate-300 p-2 rounded-lg text-center">
            <h4 className="bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mx-auto">
              Moisture After
            </h4>

            <Progress
              reduction={0}
              transitionDuration={0.5}
              transitionTimingFunction={'ease'}
              gradient={[
                { stop: 0.0, color: '#00bc9b' },
                { stop: 1, color: '#5eaefd' },
              ]}
              style={progressStyles}
              progress={data.at(-1).moistureAfter}
            />
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="border-2 border-slate-300 p-2 rounded-lg text-center">
            <h4 className="flex bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mr-auto ml-auto">
              Plant Mood
            </h4>
            <Image
              alt="happyplant"
              src={
                isMoreThan3DaysAgo(data.at(-1).timestamp) ||
                data.at(-1).moistureAfter < 20
                  ? '/sad.png'
                  : '/happy.png'
              }
              width={120}
              height={160}
            />
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="w-[450px] h-96">
            <ResponsiveLine
              data={graphData}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false,
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendOffset: 36,
                legendPosition: 'middle',
                truncateTickAt: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Moisture content',
                legendOffset: -40,
                legendPosition: 'middle',
                truncateTickAt: 0,
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="data.yFormatted"
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
        {!isLoading && !error && data && (
          <div className="grid mx-auto h-fit">
            <h4 className="flex bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm h-fit">
              Last Irrigation
            </h4>
            <p className="font-light text-5xl text-slate-600 mt-2">
              {data && formatRelative(data?.at(-1).timestamp, new Date())}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
