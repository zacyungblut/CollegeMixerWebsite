import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns'; //for date formatting

interface DailyStatsProps {
  dailyStats: {
    date: string;
    receivedCount: number;
    responseCount: number;
    _id: string;
  }[];
}

const DailyStatsChart: React.FC<DailyStatsProps> = ({ dailyStats }) => {
  // Sort data by date in ascending order
  dailyStats.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  
  const lastXDays = 7; // Set this to the number of days you want to display
  const slicedData = dailyStats.slice(-lastXDays);
  
  const formattedData = slicedData.map((item) => ({
    date: format(parseISO(item.date), 'dd/MM/yyyy'),
    Received: item.receivedCount || 0,
    Sent: item.responseCount || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={formattedData}>
        <XAxis dataKey="date" />
        {/* <YAxis /> */}
        <Tooltip />
        <Legend />
        <Bar minPointSize={1} stackId="a" dataKey="Received" fill="#475569" />
        <Bar minPointSize={1} stackId="a" dataKey="Sent" fill="#34d399" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DailyStatsChart;
