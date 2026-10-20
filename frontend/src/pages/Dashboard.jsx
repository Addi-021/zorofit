import { useEffect, useState } from "react";
import mockdata from "../data/mockdata";
import { api } from "../api";
import ProgressChart from "../components/ProgressChart";

function Dashboard() {
  const { nutrition, workout, recentActivity } = mockdata;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    Promise.all([
      api("/users/me"),
      api("/users/me/profile"),
      api("/measurements"),
    ])
      .then(([u, p, m]) => {
        setUser(u);
        setProfile(p);
        setMeasurements(m);
      })
      .catch(() => {});
  }, []);

  const caloriePercentage = (nutrition.calories / nutrition.calorieGoal) * 100;

  const weight = profile?.current_weight_kg;
  const height = profile?.height_cm;
  const target = profile?.target_weight_kg;
  const bmi =
    weight && height ? (weight / ((height / 100) ** 2)).toFixed(1) : null;

   const weightPoints = measurements
    .filter((m) => m.weight_kg !== null)
    .sort((a, b) => a.recorded_on.localeCompare(b.recorded_on))
    .slice(-10)
    .map((m) => ({ date: m.recorded_on, value: m.weight_kg }));

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user ? user.name.split(" ")[0] : "";

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{greeting}, {firstName} 👋</h1>
          <p>Here's your fitness overview for today.</p>
        </div>

        <button className="primary-btn">+ Log Activity</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Current Weight</span>
          <strong>{weight ? `${weight} kg` : "—"}</strong>
          <small>Target: {target ? `${target} kg` : "not set"}</small>
        </div>

        <div className="stat-card">
          <span>BMI</span>
          <strong>{bmi ?? "—"}</strong>
          <small>{bmi ? "Current BMI" : "Add height and weight"}</small>
        </div>

        <div className="stat-card">
          <span>Calories</span>
          <strong>{nutrition.calories.toLocaleString()}</strong>
          <small>of {nutrition.calorieGoal.toLocaleString()} kcal</small>
        </div>

        <div className="stat-card">
          <span>Protein</span>
          <strong>{nutrition.protein} g</strong>
          <small>Goal: {nutrition.proteinGoal} g</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card weight-card">
          <div className="card-header">
            <div>
              <h2>Weight Progress</h2>
              <p>Your recent weight trend</p>
            </div>

            <span className="card-value">{weight ? `${weight} kg` : "—"}</span>
          </div>

          <ProgressChart
            points={weightPoints}
            target={target}
            unit="kg"
            label="Weight"
          />
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Today's Workout</h2>
              <p>{workout.name}</p>
            </div>

            <span className="workout-status">{workout.status}</span>
          </div>

          <div className="workout-info">
            <div>
              <strong>{workout.exercises}</strong>
              <span>Exercises</span>
            </div>

            <div>
              <strong>{workout.duration}</strong>
              <span>Minutes</span>
            </div>
          </div>

          <button className="primary-btn full-width">Start Workout</button>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Calories</h2>
              <p>Today's intake</p>
            </div>

            <span className="card-value">{Math.round(caloriePercentage)}%</span>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${caloriePercentage}%` }}
              ></div>
            </div>

            <div className="progress-labels">
              <span>{nutrition.calories.toLocaleString()} kcal</span>
              <span>{nutrition.calorieGoal.toLocaleString()} kcal</span>
            </div>
          </div>

          <div className="macro-row">
            <div>
              <span>Protein</span>
              <strong>{nutrition.protein}g</strong>
            </div>

            <div>
              <span>Carbs</span>
              <strong>{nutrition.carbs}g</strong>
            </div>

            <div>
              <span>Fat</span>
              <strong>{nutrition.fat}g</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest updates</p>
            </div>
          </div>

          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div className="activity-item" key={index}>
                <span className="activity-icon">✓</span>

                <div>
                  <strong>{activity.title}</strong>
                  <small>{activity.description}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
