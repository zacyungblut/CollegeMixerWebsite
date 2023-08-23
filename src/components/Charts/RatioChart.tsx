import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface DailyStatsProps {
  dailyStats: {
    date: string;
    receivedCount: number;
    responseCount: number;
    _id: string;
  }[];
}

const DailyStatsChart: React.FC<DailyStatsProps> = ({ dailyStats }) => {
  dailyStats.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const lastXDays = 7;
  const slicedData = dailyStats.slice(-lastXDays);

  const formattedData = slicedData.map((item) => ({
    name: format(parseISO(item.date), 'dd/MM/yyyy'),
    Received: item.receivedCount || 0,
    Sent: item.responseCount || 0,
  }));

  const COLORS = ['#34d399', '#475569'];
  
  const totalReceived = formattedData.reduce((sum, item) => sum + item.Received, 0);
  const totalSent = formattedData.reduce((sum, item) => sum + item.Sent, 0);
  const diffSentReceived = 10;

  const pieData = [
    { name: 'Non-Lead', value: totalReceived },
    { name: 'Lead', value: diffSentReceived },
  ];

  return (
    <>

        <ResponsiveContainer className="max-h-64" width="100%" height="100%">

        <PieChart>
        <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            fill="#8884d8"
            // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >

            {
                pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
        </ResponsiveContainer>
    </>
  );
}

export default DailyStatsChart;
