import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

interface UserActivity {
  userId: string;
  action: 'login' | 'rating';
  timestamp: string;
  name: string;
  age: number;
}

const FeedContainer = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  padding: 10px;
  border: 1px solid #00ff00;
  height: 400px;
  width: 48%;
  overflow-y: auto;
`;

const FeedTitle = styled.h3`
  color: #00ffff;
  text-align: center;
  margin-bottom: 10px;
`;

const FeedEntry = styled.div`
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #001100;
  }
`;

interface LiveFeedProps {
  activities: UserActivity[];
  onUserSelect: (userId: string) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ activities, onUserSelect }) => {
  return (
    <FeedContainer>
      <FeedTitle>Live User Activity Feed</FeedTitle>
      {activities.map((activity, index) => (
        <FeedEntry key={index} onClick={() => onUserSelect(activity.userId)}>
          [{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}] 
          {activity.name} ({activity.age}) {activity.action === 'login' ? 'logged in' : 'rated'}
        </FeedEntry>
      ))}
    </FeedContainer>
  );
};

export default LiveFeed;
