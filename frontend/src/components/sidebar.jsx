import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        ZOROFIT
      </div>

      <nav className="nav-menu">
        <NavLink to="/" end>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/workouts">
          🏋️ Workouts
        </NavLink>

        <NavLink to="/nutrition">
          🍎 Nutrition
        </NavLink>

        <NavLink to="/measurements">
          📏 Measurements
        </NavLink>

        <NavLink to="/notes">
          📝 Notes
        </NavLink>

        <NavLink to="/progress">
          📊 Progress
        </NavLink>

        <NavLink to="/profile">
          👤 Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
