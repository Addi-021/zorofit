import { useState } from "react";
import mockdata from "../data/mockdata";

function Workout() {
  const { workoutPlans } = mockdata;

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Bench Press",
      sets: [
        { weight: 40, reps: 12 },
        { weight: 45, reps: 10 },
        { weight: 45, reps: 8 },
      ],
    },
    {
      id: 2,
      name: "Incline Dumbbell Press",
      sets: [
        { weight: 15, reps: 12 },
        { weight: 15, reps: 10 },
      ],
    },
    {
      id: 3,
      name: "Shoulder Press",
      sets: [
        { weight: 12, reps: 10 },
        { weight: 12, reps: 10 },
      ],
    },
    {
      id: 4,
      name: "Lateral Raises",
      sets: [
        { weight: 7, reps: 12 },
        { weight: 7, reps: 12 },
      ],
    },
  ]);

  function startWorkout(workout) {
    setSelectedWorkout(workout);
    setIsWorkoutStarted(false);
  }

  function beginWorkout() {
    setIsWorkoutStarted(true);
  }

  function closeWorkout() {
    setSelectedWorkout(null);
    setIsWorkoutStarted(false);
  }

  function updateSet(exerciseId, setIndex, field, value) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        const updatedSets = exercise.sets.map((set, index) =>
          index === setIndex
            ? { ...set, [field]: Number(value) }
            : set
        );

        return {
          ...exercise,
          sets: updatedSets,
        };
      })
    );
  }

  function addSet(exerciseId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            { weight: 0, reps: 0 },
          ],
        };
      })
    );
  }

  if (selectedWorkout && isWorkoutStarted) {
    return (
      <div className="workout-session">

        <div className="session-header">
          <div>
            <h1>{selectedWorkout.name}</h1>
            <p>{selectedWorkout.focus}</p>
          </div>

          <button
            className="secondary-btn"
            onClick={closeWorkout}
          >
            Exit Workout
          </button>
        </div>

        <div className="exercise-session-list">

          {exercises.map((exercise) => (
            <div
              className="exercise-session-card"
              key={exercise.id}
            >
              <div className="exercise-session-header">
                <h2>{exercise.name}</h2>

                <button
                  className="add-set-btn"
                  onClick={() => addSet(exercise.id)}
                >
                  + Add Set
                </button>
              </div>

              <div className="set-table">

                <div className="set-table-header">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                </div>

                {exercise.sets.map((set, index) => (
                  <div
                    className="set-row"
                    key={index}
                  >
                    <span>{index + 1}</span>

                    <input
                      type="number"
                      value={set.weight}
                      onChange={(event) =>
                        updateSet(
                          exercise.id,
                          index,
                          "weight",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      value={set.reps}
                      onChange={(event) =>
                        updateSet(
                          exercise.id,
                          index,
                          "reps",
                          event.target.value
                        )
                      }
                    />
                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>

        <div className="complete-workout">
          <button
            className="primary-btn complete-btn"
            onClick={() => {
              alert("Workout completed!");
              closeWorkout();
            }}
          >
            Complete Workout
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="workout-page">

      <div className="page-header">
        <div>
          <h1>Workouts</h1>
          <p>Choose a workout and start training.</p>
        </div>

        <button className="primary-btn">
          + Create Workout
        </button>
      </div>

      <div className="workout-section">

        <h2>My Workout Plans</h2>

        <div className="workout-plans">

          {workoutPlans.map((workout) => (
            <div
              className="workout-plan-card"
              key={workout.id}
            >

              <div className="workout-plan-top">
                <div className="workout-icon">
                  🏋️
                </div>

                <span className="workout-duration">
                  {workout.duration} min
                </span>
              </div>

              <h3>{workout.name}</h3>

              <p>{workout.focus}</p>

              <div className="workout-plan-info">
                {workout.exercises} Exercises
              </div>

              <button
                className="primary-btn full-width"
                onClick={() => startWorkout(workout)}
              >
                Start Workout
              </button>

            </div>
          ))}

        </div>
      </div>

      {selectedWorkout && (
        <div className="workout-preview">

          <div className="preview-header">
            <div>
              <h2>{selectedWorkout.name}</h2>
              <p>{selectedWorkout.focus}</p>
            </div>

            <button
              className="close-btn"
              onClick={closeWorkout}
            >
              ✕
            </button>
          </div>

          <div className="exercise-list">

            {exercises.map((exercise) => (
              <div
                className="exercise-row"
                key={exercise.id}
              >
                <strong>{exercise.name}</strong>

                <span>
                  {exercise.sets.length} sets
                </span>
              </div>
            ))}

          </div>

          <button
            className="primary-btn"
            onClick={beginWorkout}
          >
            Begin Workout
          </button>

        </div>
      )}

    </div>
  );
}

export default Workout;
