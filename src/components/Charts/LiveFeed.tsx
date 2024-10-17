import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchLiveUserActivity } from '../../api';

interface UserActivity {
  userId: string;
  action: 'login' | 'rating';
  timestamp: string;
}

const FeedContainer = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  padding: 10px;
  border: 1px solid #00ff00;
  height: 400px;
  width: 100%;
  overflow-y: auto;
`;

const FeedTitle = styled.h3`
  color: #00ffff;
  text-align: center;
  margin-bottom: 10px;
`;

const FeedEntry = styled.div`
  margin-bottom: 5px;
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #001100;
  margin-top: 10px;
`;

const LoadingProgress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: #00ff00;
  transition: width 1s linear;
`;

const LiveFeed: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLiveUserActivity();
      setActivities(data);
    };

    fetchData();
    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 30));
      if (countdown === 0) {
        fetchData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const renderLoadingBar = () => {
    const progress = ((30 - countdown) / 30) * 100;
    return (
      <LoadingBar>
        <LoadingProgress width={progress} />
      </LoadingBar>
    );
  };

  return (
    <FeedContainer>
      <FeedTitle>Live User Activity Feed</FeedTitle>
      {activities.map((activity, index) => (
        <FeedEntry key={index}>
          [{activity.timestamp}] User {activity.userId.substr(0, 8)}... {activity.action === 'login' ? 'logged in' : 'rated'}
        </FeedEntry>
      ))}
      {renderLoadingBar()}
      <div>Next update in {countdown} seconds</div>
    </FeedContainer>
  );
};

export default LiveFeed;

