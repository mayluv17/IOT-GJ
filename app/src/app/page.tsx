'use client'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';



const fetchMoistureData = async () => {
  const response = await axios.get('http://localhost:3000/api/moisture');
  return response.data.data; // Assuming the data is in the 'data' field
};


export default function Home() {

  const getMoistureQuery = {
    queryKey: ['moisture'],
    queryFn: () => fetchMoistureData()
  }

  const { data, isLoading, error } = useQuery(getMoistureQuery);

  
  return (
  <div className="m-8 flex gap-8 font-[family-name:var(--font-geist-sans)]">
  
        <div className="">
            <h4>Moisture Content</h4>
            <div className="mt-8 w-20 h-20 ">
              { !isLoading && !error && data && 
              
              <CircularProgressbar
                      value={data.at(-1).moisture}
                      strokeWidth={8}
                      styles={buildStyles({
                        textColor: 'green',
                        pathColor: '#53c100',
                      })}
                      text={`${data.at(-1).moisture}%`}
                    />}
              </div>

        </div>
      
      <div>
        <h4>Plant State</h4>
      </div>

    </div>
  );
}
