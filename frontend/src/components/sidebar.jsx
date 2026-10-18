import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../api";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">ZOROFIT</div>

      <nav className="nav-menu">
        <NavLink to="/" end>🏠 Dashboard</NavLink>
        <NavLink to="/workouts">🏋️ Workouts</NavLink>
        <NavLink to="/nutrition">🍎 Nutrition</NavLink>
        <NavLink to="/measurements">📏 Measurements</NavLink>
        <NavLink to="/notes">📝 Notes</NavLink>
        <NavLink to="/progress">📊 Progress</NavLink>
        <NavLink to="/profile">👤 Profile</NavLink>

        <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          🚪 Logout
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
