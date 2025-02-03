import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Waitlist from "./components/Waitlist";
import Privacy from "./components/Privacy";
import Support from "./components/Support";
import InternalDashboard from "./components/InternalDashboard";
import ReferFriend from "./components/ReferFriend";
import Casting from "./components/Casting";
import Dashboard from "./components/Dashboard";
import SecretLogin from "./components/SecretLogin";
import styled from "styled-components";
import BurnerPortal from "./components/BurnerPortal";
import ContentTerminal from "./components/ContentTerminal";

const FullHeightContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("omnidashAuth");
      console.log("Checking auth, token:", token);
      setIsAuthenticated(token === "authenticated");
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Redirecting to login");
      return <Navigate to="/login" replace />;
    }
    console.log("Rendering protected content");
    return <>{children}</>;
  };

  return (
    <FullHeightContainer>
      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/burners" element={<BurnerPortal />} />
        <Route path="/policy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<InternalDashboard />} />
        <Route path="/casting" element={<Casting />} />
        <Route path="/AddFriend" element={<ReferFriend />} />
        <Route
          path="/terminal"
          element={
            <ProtectedRoute>
              <ContentTerminal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </FullHeightContainer>
  );
}

export default App;
