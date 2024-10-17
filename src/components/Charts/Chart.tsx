import React from 'react';
import styled from 'styled-components';

interface DataPoint {
  date: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
  width?: number;
  lineColor?: string;
}

const ChartContainer = styled.div<{ height: number; width: number }>`
  background-color: #001100;
  border: 1px solid #00ff00;
  padding: 10px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
`;

const ChartTitle = styled.div`
  color: #00ffff;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
`;

const ChartSvg = styled.svg`
  .axis {
    stroke: #00ff00;
  }
  .axis-label {
    fill: #00ff00;
    font-size: 10px;
  }
  .data-line {
    stroke: #ff00ff;
    stroke-width: 2;
    fill: none;
  }
  .data-point {
    fill: #ff00ff;
  }
`;

const Chart: React.FC<ChartProps> = ({ data, title, height = 300, width = 600, lineColor = '#ff00ff' }) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - (value / Math.max(...data.map(d => d.value))) * chartHeight;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`)
    .join(' ');

  return (
    <ChartContainer height={height} width={width}>
      <ChartTitle>{title}</ChartTitle>
      <ChartSvg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* X and Y axes */}
          <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} className="axis" />
          <line x1="0" y1="0" x2="0" y2={chartHeight} className="axis" />

          {/* Data line */}
          <path d={linePath} className="data-line" stroke={lineColor} />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.value)}
              r="3"
              className="data-point"
              fill={lineColor}
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={chartHeight + 15}
              textAnchor="middle"
              className="axis-label"
            >
              {d.date}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <text
              key={tick}
              x="-5"
              y={yScale(tick * Math.max(...data.map(d => d.value)) / 100)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="axis-label"
            >
              {tick}%
            </text>
          ))}
        </g>
      </ChartSvg>
    </ChartContainer>
  );
};

export default Chart;
