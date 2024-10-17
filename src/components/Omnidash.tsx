import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchOmnidashMetrics, sendOmnidashNotification } from '../api';
import Chart from './Charts/Chart';
import LiveFeed from './Charts/LiveFeed';

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
  margin-bottom: 20px;
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

const LogoImage = styled.img`
  width: 300px;
  margin-bottom: 20px;
`;

const Omnidash: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [school, setSchool] = useState<string>('');
  const [notification, setNotification] = useState<string>('');
  const [loginData, setLoginData] = useState<{ date: string; value: number }[]>([]);
  const [maleLoginData, setMaleLoginData] = useState<{ date: string; value: number }[]>([]);
  const [femaleLoginData, setFemaleLoginData] = useState<{ date: string; value: number }[]>([]);
  const [feedsCreatedData, setFeedsCreatedData] = useState<{ date: string; value: number }[]>([]);
  const [feedsCompletedData, setFeedsCompletedData] = useState<{ date: string; value: number }[]>([]);
  const [avgFeedIndexData, setAvgFeedIndexData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    fetchMetrics();
  }, [school]);

  const fetchMetrics = async () => {
    try {
      const data = await fetchOmnidashMetrics(school);
      setMetrics(data);
      
      // Prepare login data for the charts
      if (data.loginsByDay) {
        setLoginData(data.loginsByDay.map((login: any) => ({
          date: login.date,
          value: login.count
        })));
      }
      if (data.maleLoginsByDay) {
        setMaleLoginData(data.maleLoginsByDay.map((login: any) => ({
          date: login.date,
          value: login.count
        })));
      }
      if (data.femaleLoginsByDay) {
        setFemaleLoginData(data.femaleLoginsByDay.map((login: any) => ({
          date: login.date,
          value: login.count
        })));
      }
      
      // Prepare feed data for the new charts
      if (data.feedsCreatedByDay) {
        setFeedsCreatedData(data.feedsCreatedByDay.map((feed: any) => ({
          date: feed.date,
          value: feed.count
        })));
      }
      if (data.feedsCompletedByDay) {
        setFeedsCompletedData(data.feedsCompletedByDay.map((feed: any) => ({
          date: feed.date,
          value: feed.count
        })));
      }
      if (data.avgFeedIndexByDay) {
        setAvgFeedIndexData(data.avgFeedIndexByDay.map((feed: any) => ({
          date: feed.date,
          value: feed.avgIndex
        })));
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // You might want to set an error state here and display it to the user
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

      <ChartRow>
        <Chart
          data={loginData}
          title="Total Logins (Last 7 Days)"
          height={250}
          width={400}
        />
        <LiveFeed />
      </ChartRow>

      <ChartRow>
        <Chart
          data={feedsCreatedData}
          title="Feeds Created (Last 7 Days)"
          height={250}
          width={400}
          lineColor="#00ff00"
        />
        <Chart
          data={feedsCompletedData}
          title="Feeds Completed (Last 7 Days)"
          height={250}
          width={400}
          lineColor="#ffff00"
        />
        <Chart
          data={avgFeedIndexData}
          title="Avg. Feed Index (Last 7 Days)"
          height={250}
          width={400}
          lineColor="#00ffff"
        />
      </ChartRow>

      <Section>
        <SectionTitle>Filters</SectionTitle>
        <Input
          type="text"
          placeholder="School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
        <Button onClick={fetchMetrics}>Apply Filter</Button>
      </Section>

      <Section>
        <SectionTitle>User Metrics</SectionTitle>
        <Metric>Logins Today: {metrics.loginsToday}</Metric>
        <Metric>Logins Last 7 Days: {metrics.loginsLast7Days}</Metric>
        <Metric>Male Logins: {metrics.maleLogins}</Metric>
        <Metric>Female Logins: {metrics.femaleLogins}</Metric>
      </Section>

      <Section>
        <SectionTitle>Feed Metrics</SectionTitle>
        <Metric>Feeds Created Today: {metrics.feedsCreatedToday}</Metric>
        <Metric>Feeds Created Last 7 Days: {metrics.feedsCreatedLast7Days}</Metric>
        <Metric>Feed Completion Rate Today: {metrics.feedCompletionRateToday}%</Metric>
        <Metric>Feed Completion Rate Last 7 Days: {metrics.feedCompletionRateLast7Days}%</Metric>
        <Metric>Average Feed Index Today: {metrics.avgFeedIndexToday}</Metric>
        <Metric>Average Feed Index Last 7 Days: {metrics.avgFeedIndexLast7Days}</Metric>
      </Section>

      <Section>
        <SectionTitle>Interaction Metrics</SectionTitle>
        <Metric>Ratings Sent Today: {metrics.ratingsSentToday}</Metric>
        <Metric>Ratings Sent Last 7 Days: {metrics.ratingsSentLast7Days}</Metric>
        <Metric>Matches Made Today: {metrics.matchesMadeToday}</Metric>
        <Metric>Matches Made Last 7 Days: {metrics.matchesMadeLast7Days}</Metric>
      </Section>

      <Section>
        <SectionTitle>Friend Metrics</SectionTitle>
        <Metric>Users With Friends: {metrics.usersWithFriends}</Metric>
        <Metric>Average Friends Per User: {metrics.avgFriendsPerUser}</Metric>
      </Section>

      <Section>
        <SectionTitle>Active Feed Items</SectionTitle>
        {metrics.activeFeedItems && metrics.activeFeedItems.map((item: any, index: number) => (
          <Metric key={index}>
            {item.name}: Engagement Rate {item.engagementRate}%
          </Metric>
        ))}
      </Section>

      <Section>
        <SectionTitle>Send Notification</SectionTitle>
        <Input
          type="text"
          placeholder="Notification message"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
        />
        <Button onClick={sendNotification}>Send to All Users</Button>
      </Section>

      <ChartSection>
        <SectionTitle>User Logins (Last 7 Days)</SectionTitle>
        <Chart
          data={loginData}
          title="Daily User Logins"
          height={300}
          width={600}
        />
      </ChartSection>
    </Terminal>
  );
};

export default Omnidash;
