import mockdata from "../data/mockdata";

function Dashboard() {
  const { user, nutrition, workout, recentActivity, } = mockdata;

  const caloriePercentage =
    (nutrition.calories / nutrition.calorieGoal) * 100;

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Good morning, {user.name} 👋</h1>
          <p>Here's your fitness overview for today.</p>
        </div>

        <button className="primary-btn">
          + Log Activity
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">

        <div className="stat-card">
          <span>Current Weight</span>
          <strong>{user.weight} kg</strong>
          <small>Target: {user.targetWeight} kg</small>
        </div>

        <div className="stat-card">
          <span>BMI</span>
          <strong>{user.bmi}</strong>
          <small>Current BMI</small>
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

      {/* Main grid */}
      <div className="dashboard-grid">

        {/* Weight Progress */}
        <div className="dashboard-card weight-card">

          <div className="card-header">
            <div>
              <h2>Weight Progress</h2>
              <p>Your recent weight trend</p>
            </div>

            <span className="card-value">
              {user.weight} kg
            </span>
          </div>

          <div className="chart-placeholder">

            <div className="chart-line">
              <span>100</span>
              <span>99</span>
              <span>98</span>
              <span>97</span>
            </div>

            <div className="chart">
              <div className="chart-point point-1"></div>
              <div className="chart-point point-2"></div>
              <div className="chart-point point-3"></div>
              <div className="chart-point point-4"></div>
              <div className="chart-point point-5"></div>
            </div>

          </div>

        </div>

        {/* Today's Workout */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Today's Workout</h2>
              <p>{workout.name}</p>
            </div>

            <span className="workout-status">
              {workout.status}
            </span>
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

          <button className="primary-btn full-width">
            Start Workout
          </button>

        </div>

        {/* Calories */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Calories</h2>
              <p>Today's intake</p>
            </div>

            <span className="card-value">
              {Math.round(caloriePercentage)}%
            </span>
          </div>

          <div className="progress-container">

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${caloriePercentage}%` }}
              ></div>
            </div>

            <div className="progress-labels">
              <span>
                {nutrition.calories.toLocaleString()} kcal
              </span>

              <span>
                {nutrition.calorieGoal.toLocaleString()} kcal
              </span>
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

        {/* Recent Activity */}
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

                <span className="activity-icon">
                  ✓
                </span>

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
