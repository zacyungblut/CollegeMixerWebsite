import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchOmnidashMetrics, sendOmnidashNotification, fetchLiveUserActivity } from '../api';
import BarChart from './Charts/BarCharts';
import LiveFeed from './Charts/LiveFeed';
import UserActivityFeed from './Charts/UserActivityFeed';
import GlobalUpdateBar from './GlobalUpdateBar';

const Terminal = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  overflow: auto;
  min-height: 100vh;
`;

const Title = styled.pre`
  color: #ffffff;
  text-align: center;
  margin-bottom: -10px;
`;

const Subtitle = styled.h2`
  color: #ffffff;
  text-align: center;
  font-weight: 600;
  margin-bottom: 40px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #00ffff;
  border-bottom: 1px solid #00ffff;
  padding-bottom: 5px;
`;

const Metric = styled.p`
  margin: 5px 0;
`;

const Input = styled.input`
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #003300;
  }
`;

const ChartSection = styled(Section)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ChartRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FeedRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const KPIContainer = styled.div`
  background-color: #001100;
  border: 2px solid #00ff00;
  padding: 20px;
  text-align: center;
  margin-bottom: 40px;
`;

const KPITitle = styled.h3`
  color: #00ffff;
  margin-bottom: 10px;
`;

const KPIValue = styled.div`
  color: #00ff00;
  font-size: 48px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const Omnidash: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [school, setSchool] = useState<string>('');
  const [notification, setNotification] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [latestUserId, setLatestUserId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [liveActivities, setLiveActivities] = useState<any[]>([]);
  const [activeRelationships, setActiveRelationships] = useState<number>(0);
  const [actionsByHour, setActionsByHour] = useState<{ hour: string; count: number }[]>([]);
  const [signupsByDay, setSignupsByDay] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchLiveActivity();

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          fetchMetrics();
          fetchLiveActivity();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [school]);

  const fetchMetrics = async () => {
    try {
      const data = await fetchOmnidashMetrics(school);
      setMetrics(data);
      setActiveRelationships(data.activeRelationships || 0);
      
      if (data.actionsByHour) {
        setActionsByHour(data.actionsByHour);
      }
      
      if (data.signupsByDay) {
        setSignupsByDay(data.signupsByDay);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchLiveActivity = async () => {
    try {
      const data = await fetchLiveUserActivity();
      setLiveActivities(data);
      if (data.length > 0) {
        setLatestUserId(data[0].userId);
      }
    } catch (error) {
      console.error('Error fetching live user activity:', error);
    }
  };

  const sendNotification = async () => {
    try {
      await sendOmnidashNotification(notification);
      alert('Notification sent successfully!');
      setNotification('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setLatestUserId(userId);
  };

  const handleRefresh = () => {
    fetchMetrics();
    fetchLiveActivity();
    setCountdown(30);
  };

  return (
    <Terminal>
      <Title>
        {`
 __  __ _____  ______ ____  
|  \\/  |_ _\\ \\/ / ___|  _ \\ 
| |\\/| || | \\  /|  _| | |_) |
| |  | || | /  \\| |___|  _ < 
|_|  |_|___/_/\\_\\_____|_| \\_\\
  `}
      </Title>
      <Subtitle>The Ultimate Dating App</Subtitle>

      <KPIContainer>
        <KPITitle>Active Relationships</KPITitle>
        <KPIValue>{activeRelationships.toString().padStart(6, '0')}</KPIValue>
      </KPIContainer>

      <FeedRow>
        <LiveFeed activities={liveActivities} onUserSelect={handleUserSelect} />
        <UserActivityFeed 
          userId={selectedUserId} 
          latestUserId={latestUserId} 
          countdown={countdown}
        />
      </FeedRow>

      <BarChart
        data={actionsByHour}
        title="Actions Today (Last 12 Hours)"
      />

      <BarChart
        data={signupsByDay}
        title="User Signups (Last 7 Days)"
      />

      <GlobalUpdateBar countdown={countdown} onRefresh={handleRefresh} />
    </Terminal>
  );
};

export default Omnidash;
