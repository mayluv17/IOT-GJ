"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Progress } from "react-circle-progress-bar";
import Image from "next/image"
import { format, subDays, formatRelative, parseISO } from 'date-fns';

import { eu } from 'date-fns/locale';

const fetchMoistureData = async () => {
  const response = await axios.get("/api/moisture");
  return response.data.data; // Assuming the data is in the 'data' field
};

const progressStyles = {};

const isMoreThan3DaysAgo = (timestamp: string): boolean => {
  const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  const givenTimestamp = new Date(timestamp).getTime();
  const currentTimestamp = Date.now();

  return currentTimestamp - givenTimestamp > threeDaysInMilliseconds;
};


const formatTimestamp = (timestamp: string): string => {
  // Parse the given timestamp as a Date object
  const givenDate = new Date(timestamp);
  

  // Get the current date in UTC
  const now = new Date();

  // Use formatRelative with a specific locale
  const relativeDate = formatRelative(givenDate, now, { locale: eu });

  // Format the time part separately in UTC
  const formattedTime = format(givenDate, 'h:mm a', { locale: eu });

  // Combine the relative date with the formatted time
  return `${relativeDate} at ${formattedTime}`;
};

export default function Home() {
  const getMoistureQuery = {
    queryKey: ["moisture"],
    queryFn: () => fetchMoistureData(),
  };

  const { data, isLoading, error } = useQuery(getMoistureQuery);

  return (
    <>
    <p className="p-4 pl-8 bold font-bold text-xl text-blue-600">Plantly<small className="text-slate-600 text-xs ml-1 font-thin">Dashboard</small></p>
      <hr />
    <div className="m-8 flex flex-wrap gap-8 font-[family-name:var(--font-geist-sans)] ">
      <div className="border-2 border-slate-300 p-2 rounded-lg text-center">
        <h4 className="bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mx-auto">Moisture Before</h4>

        {!isLoading && !error && data && (
          <Progress
          reduction={0}
          transitionDuration={0.5}
          transitionTimingFunction={"ease"}
            gradient={[
              { stop: 0.0, color: "#00bc9b" },
              { stop: 1, color: "#5eaefd" },
            ]}
            style={progressStyles}
            progress={data.at(-1).moistureBefore}
          />
        )}


      </div>
      <div className="border-2 border-slate-300 p-2 rounded-lg text-center">
        <h4 className="bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mx-auto">Moisture After</h4>
        {!isLoading && !error && data && (
          <Progress
          reduction={0}
          transitionDuration={0.5}
          transitionTimingFunction={"ease"}
            gradient={[
              { stop: 0.0, color: "#00bc9b" },
              { stop: 1, color: "#5eaefd" },
            ]}
            style={progressStyles}
            progress={data.at(-1).moistureAfter}
          />
        )}
      </div>

      <div className="border-2 border-slate-300 p-2 rounded-lg text-center">
        <h4 className="flex bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm mr-auto ml-auto">Plant Mood</h4>
        {!isLoading && !error && data && 
        (
        
        <Image alt="happyplant" src={isMoreThan3DaysAgo(data.at(-1).timestamp) ? "/sad.png" : "/happy.png"} width={120} height={160}/>
        )}
      </div>

      <div className="grid h-fit">
      <h4 className="flex bg-blue-500 font-light text-white p-1 px-3 rounded-2xl w-fit text-sm h-fit">Last Irrigation</h4>
      <p className="font-light text-5xl text-slate-600 mt-2">{data && formatTimestamp(data?.at(-1).timestamp)}</p>

    </div>
    </div>
  
    </>
  );
}
