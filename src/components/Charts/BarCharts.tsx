import React from 'react';
import styled from 'styled-components';

interface BarChartProps {
  data: { hour?: string; date?: string; count: number; uniqueUsers?: number }[];
  title: string;
}

const ChartContainer = styled.div`
  background-color: #001100;
  border: 1px solid #00ff00;
  padding: 20px;
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 20px;
`;

const ChartTitle = styled.div`
  color: #00ffff;
  font-size: 18px;
  margin-bottom: 30px;
`;

const BarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
`;

const Bar = styled.div<{ height: number }>`
  width: 7%;
  height: ${props => props.height}%;
  background-color: #00ff00;
  position: relative;
`;

const BarLabel = styled.div`
  color: #00ff00;
  font-size: 10px;
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
`;

const BarValue = styled.div`
  color: #00ff00;
  font-size: 10px;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
`;

const UniqueUsers = styled.div`
  color: #ff0000;
  font-size: 10px;
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
`;

const TotalActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #00ff00;
  font-size: 24px;
  font-weight: bold;
`;

const NoDataMessage = styled.div`
  color: #00ff00;
  font-size: 18px;
  text-align: center;
  margin-top: 100px;
`;

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <NoDataMessage>No data available</NoDataMessage>
      </ChartContainer>
    );
  }

  const maxValue = Math.max(...data.map(item => item.count));
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalUniqueUsers = data.reduce((sum, item) => sum + (item.uniqueUsers || 0), 0);

  const isHourlyData = 'hour' in data[0];

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <TotalActions>
        {totalCount} {isHourlyData ? 'actions' : 'signups'}
        {isHourlyData && ` (${totalUniqueUsers} unique users)`}
      </TotalActions>
      <BarContainer>
        {data.map((item, index) => (
          <Bar key={index} height={(item.count / (maxValue || 1)) * 100}>
            <BarValue>{item.count}</BarValue>
            <BarLabel>{item.hour || item.date}</BarLabel>
          </Bar>
        ))}
      </BarContainer>
    </ChartContainer>
  );
};

export default BarChart;
