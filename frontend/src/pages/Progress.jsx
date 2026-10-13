
import { useState } from "react";

function Progress() {
  const [period, setPeriod] = useState("1M");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Progress</h1>
          <p>Track your fitness journey and achievements.</p>
        </div>

        <select
          className="progress-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="1W">Last 7 days</option>
          <option value="1M">Last 30 days</option>
          <option value="3M">Last 3 months</option>
          <option value="1Y">Last year</option>
        </select>
      </div>

      {/* Weight Progress */}
      <section className="progress-section">
        <h2>Weight Progress</h2>

        <div className="progress-empty">
          <div className="progress-empty-icon">↗</div>
          <h3>No weight history yet</h3>
          <p>
            Record your weight in Measurements to see
            your progress over time.
          </p>
        </div>
      </section>

      {/* Body Measurements */}
      <section className="progress-section">
        <h2>Body Measurements</h2>

        <div className="progress-measurement-grid">
          {["Chest", "Waist", "Hips", "Arms", "Thighs"].map(
            (measurement) => (
              <div
                className="progress-measurement-card"
                key={measurement}
              >
                <span>{measurement}</span>
                <strong>—</strong>
                <small>No records yet</small>
              </div>
            )
          )}
        </div>
      </section>

      {/* Workout Activity */}
      <section className="progress-section">
        <h2>Workout Activity</h2>

        <div className="progress-empty">
          <div className="progress-empty-icon">↗</div>
          <h3>No workout history yet</h3>
          <p>
            Complete workouts to see your activity and
            consistency here.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Progress;
