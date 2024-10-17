import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchUserActivity } from '../../api';
import { formatDistanceToNow, format } from 'date-fns';

interface UserActivity {
  action: string;
  timestamp: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  birthday?: string;
  gender?: string;
  photos: string[];
  lastLoggedIn?: string;
  year?: string;
  program?: string;
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

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FeedTitle = styled.h3`
  color: #00ffff;
  margin: 0;
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleOption = styled.span<{ active: boolean }>`
  color: ${props => props.active ? '#00ffff' : '#00ff00'};
  margin: 0 5px;
`;

const FeedEntry = styled.div`
  margin-bottom: 5px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const UserPhoto = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 2px;
  border: 2px solid lightgreen;
  margin-right: 10px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UserDetail = styled.span`
  margin-right: 10px;
  margin-bottom: 5px;
`;

interface UserActivityFeedProps {
  userId: string | null;
  latestUserId: string | null;
  countdown: number;
}

const UserActivityFeed: React.FC<UserActivityFeedProps> = ({ userId, latestUserId, countdown }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAutoLock, setIsAutoLock] = useState(false);
  const [displayedUserId, setDisplayedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const targetUserId = isAutoLock ? latestUserId : userId;
      if (targetUserId && (isAutoLock || targetUserId !== displayedUserId)) {
        const data = await fetchUserActivity(targetUserId);
        setActivities(data.activities);
        setUserInfo(data.userInfo);
        setDisplayedUserId(targetUserId);
      }
    };

    fetchData();
  }, [userId, latestUserId, isAutoLock, countdown]);

  const toggleMode = () => {
    setIsAutoLock(!isAutoLock);
    setDisplayedUserId(null);
  };

  if (!displayedUserId || !userInfo) {
    return (
      <FeedContainer>
        <FeedHeader>
          <FeedTitle>User Activity Feed</FeedTitle>
          <Toggle onClick={toggleMode}>
            [{isAutoLock ? 'X' : ' '}] Auto-Lock
          </Toggle>
        </FeedHeader>
        <div>Select a user to view their activity</div>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>User Activity Feed</FeedTitle>
        <Toggle onClick={toggleMode}>
          [{isAutoLock ? 'X' : ' '}] Auto-Lock
        </Toggle>
      </FeedHeader>
      <UserInfo>
        {userInfo.photos[0] && <UserPhoto src={userInfo.photos[0]} alt="User" />}
        <UserDetails>
          <UserDetail>Name: {userInfo.name}</UserDetail>
          <UserDetail>Email: {userInfo.email}</UserDetail>
          {userInfo.birthday && (
            <UserDetail>Birthday: {format(new Date(userInfo.birthday), 'yyyy-MM-dd')}</UserDetail>
          )}
          {userInfo.gender && <UserDetail>Gender: {userInfo.gender}</UserDetail>}
          {userInfo.year && <UserDetail>Year: {userInfo.year}</UserDetail>}
          {userInfo.program && <UserDetail>Program: {userInfo.program}</UserDetail>}
          {userInfo.lastLoggedIn && (
            <UserDetail>
              Last Login: {formatDistanceToNow(new Date(userInfo.lastLoggedIn), { addSuffix: true })}
            </UserDetail>
          )}
        </UserDetails>
      </UserInfo>
      {activities.map((activity, index) => (
        <FeedEntry key={index}>
          [{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}] {activity.action}
        </FeedEntry>
      ))}
    </FeedContainer>
  );
};

export default UserActivityFeed;
