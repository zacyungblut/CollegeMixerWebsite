import React, { useState, useEffect } from "react";
import WinderLogo from "src/assets/WinderLogo.gif";
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
    const [notificationSubject, setNotificationSubject] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace '/api/user-data' with the actual endpoint
        axios.get('/api/user-data')
            .then((response) => {
                const transformedData = transformDataForChart(response.data);
                setChartData(transformedData);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const transformDataForChart = (data) => {
        return {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Users Created Per Day',
                data: data.map(item => item.count),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    };

    return (

        
        <div className="items-center justify-center p-2">
            <img src={WinderLogo} className="w-[100px] h-[100px] mx-auto my-2" />
            {/* Dashboard content */}
            {/* ... */}
            {/* Place the chart component where you want the chart to appear */}
            <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">User Creation Chart</h2>
                {loading ? <p>Loading Chart...</p> : <Line data={chartData} />}
            </div>
        </div>
    );
};

export default Dashboard;