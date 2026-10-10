import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";

import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Measurements from "./pages/Measurements";
import Notes from "./pages/Notes";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workout />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
