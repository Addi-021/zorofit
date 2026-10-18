import { useEffect, useState } from "react";
import { api } from "../api";
import ProgressChart from "../components/ProgressChart";

const periodDays = { "1W": 7, "1M": 30, "3M": 90, "1Y": 365 };

const metrics = [
  { key: "weight_kg", label: "Weight", unit: "kg" },
  { key: "waist_cm", label: "Waist", unit: "cm" },
  { key: "chest_cm", label: "Chest", unit: "cm" },
  { key: "hips_cm", label: "Hips", unit: "cm" },
  { key: "arms_cm", label: "Arms", unit: "cm" },
  { key: "thighs_cm", label: "Thighs", unit: "cm" },
];

function Progress() {
  const [period, setPeriod] = useState("3M");
  const [metricKey, setMetricKey] = useState("weight_kg");
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/measurements"), api("/users/me/profile")])
      .then(([m, p]) => {
        setEntries(m);
        setProfile(p);
      })
      .catch((err) => setError(err.message));
  }, []);

  const metric = metrics.find((m) => m.key === metricKey);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays[period]);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const points = entries
    .filter((e) => e.recorded_on >= cutoffStr && e[metric.key] !== null)
    .sort((a, b) => a.recorded_on.localeCompare(b.recorded_on))
    .map((e) => ({ date: e.recorded_on, value: e[metric.key] }));

  const target =
    metric.key === "weight_kg" ? profile?.target_weight_kg ?? null : null;

  const start = points.length ? points[0].value : null;
  const current = points.length ? points[points.length - 1].value : null;
  const change =
    points.length > 1 ? Number((current - start).toFixed(1)) : null;
  const toGo =
    target && current !== null ? Math.abs(current - target).toFixed(1) : null;

  const fmt = (v) => (v === null ? "—" : `${v} ${metric.unit}`);

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

      {error && <p className="profile-notice">{error}</p>}

      <section className="progress-section">
        <div className="metric-tabs">
          {metrics.map((m) => (
            <button
              key={m.key}
              className={`metric-tab ${m.key === metricKey ? "active" : ""}`}
              onClick={() => setMetricKey(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="summary-row">
          <div className="summary-item">
            <span>Start of period</span>
            <strong>{fmt(start)}</strong>
          </div>

          <div className="summary-item">
            <span>Current</span>
            <strong>{fmt(current)}</strong>
          </div>

          <div className="summary-item">
            <span>Change</span>
            <strong>
              {change === null
                ? "—"
                : `${change > 0 ? "+" : ""}${change} ${metric.unit}`}
            </strong>
          </div>

          {metric.key === "weight_kg" && (
            <div className="summary-item">
              <span>To target</span>
              <strong>{toGo ? `${toGo} kg to go` : "Set a target"}</strong>
            </div>
          )}
        </div>

        <ProgressChart
          points={points}
          target={target}
          unit={metric.unit}
          label={metric.label}
        />
      </section>

      <section className="progress-section">
        <h2>Workout Activity</h2>

        <div className="progress-empty">
          <div className="progress-empty-icon">↗</div>
          <h3>No workout history yet</h3>
          <p>Complete workouts to see your activity and consistency here.</p>
        </div>
      </section>
    </div>
  );
}

export default Progress;
