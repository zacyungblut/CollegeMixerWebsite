import React from 'react';
import styled from 'styled-components';

const BarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #001100;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 20px;
  background-color: #003300;
  margin-right: 10px;
`;

const LoadingProgress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: #00ff00;
  transition: width 1s linear;
`;

const UpdateText = styled.div`
  color: #00ff00;
  font-family: 'Courier New', monospace;
  margin-right: 10px;
`;

const RefreshButton = styled.button`
  background-color: #003300;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px 10px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  &:hover {
    background-color: #004400;
  }
`;

interface GlobalUpdateBarProps {
  countdown: number;
  onRefresh: () => void;
}

const GlobalUpdateBar: React.FC<GlobalUpdateBarProps> = ({ countdown, onRefresh }) => {
  const progress = ((30 - countdown) / 30) * 100;

  return (
    <BarContainer>
      <LoadingBar>
        <LoadingProgress width={progress} />
      </LoadingBar>
      <UpdateText>Next update in {countdown} seconds</UpdateText>
      <RefreshButton onClick={onRefresh}>Refresh Now</RefreshButton>
    </BarContainer>
  );
};

export default GlobalUpdateBar;
