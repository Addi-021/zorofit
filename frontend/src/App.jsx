import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/sidebar";
import { api, getToken } from "./api";

import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Measurements from "./pages/Measurements";
import Journal from "./pages/Journal";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function ProtectedLayout() {
  const [status, setStatus] = useState("loading");
  const location = useLocation();
  const loggedIn = Boolean(getToken());

  useEffect(() => {
    if (!loggedIn) return;
    api("/users/me/profile")
      .then((p) => setStatus(p.onboarding_completed ? "done" : "needed"))
      .catch(() => setStatus("done"));
  }, [loggedIn]);

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (status === "loading") {
    return <div className="page">Loading...</div>;
  }

  const onOnboarding = location.pathname === "/onboarding";

  if (status === "needed" && !onOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (status === "done" && onOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  if (onOnboarding) {
    return <Outlet context={{ markDone: () => setStatus("done") }} />;
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Outlet context={{ markDone: () => setStatus("done") }} />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workout />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
