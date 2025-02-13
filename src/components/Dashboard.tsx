import React, { useState, useEffect } from "react";
import { getUserPhoneStats, getUserLocations } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import styled from "styled-components";
import MixerLogo from "../assets/Mixer-Logo.png";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DashboardContainer = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderLogo = styled.img`
  height: 40px;
  margin-right: 16px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: flex-bottom;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #1e293b;
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 600;
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  input[type="date"] {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #475569;
    background: #f8fafc;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
  }
`;

const DateLabel = styled.span`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #2196f3;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;

  &::after {
    content: "";
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, #e2e8f0, transparent);
    margin-left: 16px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 500px;

  .recharts-default-tooltip {
    background: rgba(255, 255, 255, 0.95) !important;
    border: none !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
    padding: 12px !important;
  }
`;

const FunnelContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

const StepBar = styled.div<{ percentage: number }>`
  height: 24px;
  background: linear-gradient(
    to right,
    #2196f3 ${(props) => props.percentage}%,
    #e2e8f0 ${(props) => props.percentage}%
  );
  border-radius: 12px;
  margin: 8px 0;
  transition: all 0.3s;
`;

const StepLabel = styled.div`
  display: flex;
  justify-content: space-between;
  color: #475569;
  font-size: 14px;
  margin-bottom: 4px;
`;

const StepMetrics = styled.div`
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 12px;
`;

interface Step {
  name: string;
  count: number;
  percentage: number;
}

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Update your styled MapContainer
const MapContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;

  .leaflet-container {
    height: 400px;
    width: 100%;
    border-radius: 8px;
  }
`;

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ data: statsData }, { data: locationsData }] =
          await Promise.all([
            getUserPhoneStats(startDate, endDate),
            getUserLocations(startDate, endDate),
          ]);
        setStats(statsData);
        setLocations(locationsData);
        console.log("Locations data:", locationsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  if (!stats) return <div>Loading...</div>;

  return (
    <DashboardContainer>
      <Header>
        <HeaderTitle>
          <HeaderLogo src={MixerLogo} alt="Mixer Logo" />
          <Title>Dashboard</Title>
        </HeaderTitle>
        <DateRangeContainer>
          <DateLabel>Date Range:</DateLabel>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DateRangeContainer>
      </Header>

      <FunnelContainer>
        <Title>User Onboarding Funnel</Title>
        {stats.summary.steps.map((step: Step, index: number) => (
          <div key={step.name}>
            <StepLabel>
              <span>{step.name}</span>
              <StepMetrics>
                <span>{step.count.toLocaleString()} users</span>
                <span>{step.percentage}%</span>
              </StepMetrics>
            </StepLabel>
            <StepBar percentage={step.percentage} />
          </div>
        ))}
      </FunnelContainer>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.summary.totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.summary.usersWithPhone}</StatValue>
          <StatLabel>Users with Phone</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.summary.phoneVerificationRate}%</StatValue>
          <StatLabel>Phone Verification Rate</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stats.dailyStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="_id"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="withPhone"
              name="With Phone"
              stroke="#2196f3"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="withoutPhone"
              name="Without Phone"
              stroke="#f44336"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer> */}

      <MapContainer>
        <Title>User Locations ({locations.length} users)</Title>
        <LeafletMapContainer
          center={[39.8283, -98.5795]} // Center of USA
          zoom={4}
          scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lng]}>
              <Popup>User Location</Popup>
            </Marker>
          ))}
        </LeafletMapContainer>
      </MapContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
