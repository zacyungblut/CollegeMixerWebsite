import React, { useState, useEffect } from "react";
import WinderLogo from "../assets/WinderLogo.gif";
import { useAppDispatch } from "../hooks/hooks";
import { getUserActions } from "../actions/analytics";
import { Line } from 'react-chartjs-2';
import { UserAction } from '../interfaces/UserActionData';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartOptions } from 'chart.js';

const DailyLikesChart = () => {
    const [likesData, setLikesData] = useState<UserAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userActionsResp = await dispatch<any>(getUserActions());
                if (userActionsResp && userActionsResp.status === 200 && Array.isArray(userActionsResp.actions)) {
                    setLikesData(userActionsResp.actions);
                } else {
                    setError('Failed to load data or invalid response structure');
                }
            } catch (error) {
                setError('An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    if (isLoading) {
        return <img src={WinderLogo} alt="Loading..." />;
    }

    if (error || !likesData) {
        return <p>{error || 'No data available'}</p>;
    }

    const chartData = {
        labels: likesData.map(data => new Date(data._id.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Likes per Day',
                data: likesData.map(data => data.count || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Count'
                }
            }
        },
        plugins: {
            legend: {
                display: true
            }
        }
    };

    return (
        <div style={{ width: '`600px', height: '400px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default DailyLikesChart;
