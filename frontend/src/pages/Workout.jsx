import { useEffect, useState } from "react";
import { api } from "../api";

function Workout() {
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [sessionSets, setSessionSets] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── New plan form state ──
  const [newPlan, setNewPlan] = useState({
    name: "",
    focus: "",
    duration_min: "",
  });
  const [selectedExercises, setSelectedExercises] = useState([]);

  // ── Load plans & exercise library ──
  useEffect(() => {
    Promise.all([api("/workouts/plans"), api("/workouts/exercises")])
      .then(([p, e]) => {
        setPlans(p);
        setExercises(e);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Plan actions ──
  function selectPlan(plan) {
    setSelectedPlan(plan);
    setIsWorkoutStarted(false);
    // Build session sets from plan exercises
    const sets = [];
    for (const pe of plan.exercises) {
      for (let i = 1; i <= pe.target_sets; i++) {
        sets.push({
          exercise_id: pe.exercise.id,
          exercise_name: pe.exercise.name,
          set_number: i,
          weight: "",
          reps: pe.target_reps,
        });
      }
    }
    setSessionSets(sets);
  }

  function beginWorkout() {
    setIsWorkoutStarted(true);
  }

  function closeWorkout() {
    setSelectedPlan(null);
    setIsWorkoutStarted(false);
    setSessionSets([]);
  }

  function updateSessionSet(index, field, value) {
    setSessionSets((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  }

  function addSessionSet(exerciseId, exerciseName) {
    const existing = sessionSets.filter((s) => s.exercise_id === exerciseId);
    const nextNum = existing.length + 1;
    setSessionSets((prev) => [
      ...prev,
      {
        exercise_id: exerciseId,
        exercise_name: exerciseName,
        set_number: nextNum,
        weight: "",
        reps: "",
      },
    ]);
  }

  async function completeWorkout() {
    const payload = {
      plan_id: selectedPlan.id,
      notes: null,
      sets: sessionSets
        .filter((s) => s.weight !== "" || s.reps !== "")
        .map((s) => ({
          exercise_id: s.exercise_id,
          set_number: s.set_number,
          weight_kg: s.weight !== "" ? Number(s.weight) : null,
          reps: s.reps !== "" ? Number(s.reps) : null,
        })),
    };

    try {
      await api("/workouts/logs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("Workout completed and saved! 💪");
      closeWorkout();
    } catch (err) {
      alert("Could not save: " + err.message);
    }
  }

  // ── Create plan ──
  function toggleExercise(ex) {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.id === ex.id);
      if (exists) return prev.filter((e) => e.id !== ex.id);
      return [...prev, { ...ex, target_sets: 3, target_reps: 10 }];
    });
  }

  function updatePlanExercise(exId, field, value) {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.id === exId ? { ...e, [field]: Number(value) } : e
      )
    );
  }

  async function savePlan(e) {
    e.preventDefault();
    if (!newPlan.name.trim()) return;

    const payload = {
      name: newPlan.name,
      focus: newPlan.focus || null,
      duration_min: newPlan.duration_min ? Number(newPlan.duration_min) : null,
      exercises: selectedExercises.map((ex, i) => ({
        exercise_id: ex.id,
        order: i,
        target_sets: ex.target_sets,
        target_reps: ex.target_reps,
      })),
    };

    try {
      const created = await api("/workouts/plans", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setPlans((prev) => [created, ...prev]);
      setShowCreate(false);
      setNewPlan({ name: "", focus: "", duration_min: "" });
      setSelectedExercises([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function deletePlan(planId) {
    if (!confirm("Delete this workout plan?")) return;
    try {
      await api(`/workouts/plans/${planId}`, { method: "DELETE" });
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      alert(err.message);
    }
  }

  // ── Group session sets by exercise for display ──
  function groupedSets() {
    const groups = [];
    const seen = new Set();
    for (const s of sessionSets) {
      if (!seen.has(s.exercise_id)) {
        seen.add(s.exercise_id);
        groups.push({
          exercise_id: s.exercise_id,
          exercise_name: s.exercise_name,
        });
      }
    }
    return groups;
  }

  // ── Loading state ──
  if (loading) {
    return <div className="page">Loading workouts...</div>;
  }

  // ── Active workout session view ──
  if (selectedPlan && isWorkoutStarted) {
    const groups = groupedSets();
    return (
      <div className="workout-session">
        <div className="session-header">
          <div>
            <h1>{selectedPlan.name}</h1>
            <p>{selectedPlan.focus}</p>
          </div>
          <button className="secondary-btn" onClick={closeWorkout}>
            Exit Workout
          </button>
        </div>

        <div className="exercise-session-list">
          {groups.map((g) => {
            const sets = sessionSets.filter(
              (s) => s.exercise_id === g.exercise_id
            );
            return (
              <div className="exercise-session-card" key={g.exercise_id}>
                <div className="exercise-session-header">
                  <h2>{g.exercise_name}</h2>
                  <button
                    className="add-set-btn"
                    onClick={() =>
                      addSessionSet(g.exercise_id, g.exercise_name)
                    }
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

                  {sets.map((set) => {
                    const idx = sessionSets.indexOf(set);
                    return (
                      <div className="set-row" key={idx}>
                        <span>{set.set_number}</span>
                        <input
                          type="number"
                          value={set.weight}
                          placeholder="kg"
                          onChange={(ev) =>
                            updateSessionSet(idx, "weight", ev.target.value)
                          }
                        />
                        <input
                          type="number"
                          value={set.reps}
                          placeholder="reps"
                          onChange={(ev) =>
                            updateSessionSet(idx, "reps", ev.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="complete-workout">
          <button
            className="primary-btn complete-btn"
            onClick={completeWorkout}
          >
            Complete Workout
          </button>
        </div>
      </div>
    );
  }

  // ── Muscle group filter for exercise picker ──
  const muscleGroups = [...new Set(exercises.map((e) => e.muscle_group))].sort();

  // ── Main workout page ──
  return (
    <div className="workout-page">
      <div className="page-header">
        <div>
          <h1>Workouts</h1>
          <p>Choose a workout and start training.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Cancel" : "+ Create Workout"}
        </button>
      </div>

      {/* ── Create plan form ── */}
      {showCreate && (
        <div className="workout-section">
          <h2>New Workout Plan</h2>
          <form className="create-plan-form" onSubmit={savePlan}>
            <div className="create-plan-fields">
              <input
                type="text"
                placeholder="Plan name *"
                value={newPlan.name}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Focus (e.g. Chest, Triceps)"
                value={newPlan.focus}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, focus: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={newPlan.duration_min}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration_min: e.target.value })
                }
              />
            </div>

            <h3>Select Exercises</h3>
            {muscleGroups.map((group) => (
              <div key={group} className="exercise-group">
                <h4>{group}</h4>
                <div className="exercise-pick-list">
                  {exercises
                    .filter((e) => e.muscle_group === group)
                    .map((ex) => {
                      const selected = selectedExercises.find(
                        (s) => s.id === ex.id
                      );
                      return (
                        <div
                          key={ex.id}
                          className={`exercise-pick-item ${
                            selected ? "picked" : ""
                          }`}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={() => toggleExercise(ex)}
                            />
                            {ex.name}
                            <small>{ex.equipment}</small>
                          </label>
                          {selected && (
                            <div className="exercise-pick-config">
                              <input
                                type="number"
                                value={selected.target_sets}
                                min="1"
                                max="20"
                                onChange={(e) =>
                                  updatePlanExercise(
                                    ex.id,
                                    "target_sets",
                                    e.target.value
                                  )
                                }
                              />
                              <span>sets ×</span>
                              <input
                                type="number"
                                value={selected.target_reps}
                                min="1"
                                max="100"
                                onChange={(e) =>
                                  updatePlanExercise(
                                    ex.id,
                                    "target_reps",
                                    e.target.value
                                  )
                                }
                              />
                              <span>reps</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}

            <button type="submit" className="primary-btn" style={{ marginTop: 16 }}>
              Save Plan
            </button>
          </form>
        </div>
      )}

      {/* ── Plan cards ── */}
      <div className="workout-section">
        <h2>My Workout Plans</h2>

        {plans.length === 0 && (
          <p className="workout-empty">
            No workout plans yet. Create your first plan above!
          </p>
        )}

        <div className="workout-plans">
          {plans.map((plan) => (
            <div className="workout-plan-card" key={plan.id}>
              <div className="workout-plan-top">
                <div className="workout-icon">🏋️</div>
                {plan.duration_min && (
                  <span className="workout-duration">
                    {plan.duration_min} min
                  </span>
                )}
              </div>

              <h3>{plan.name}</h3>
              {plan.focus && <p>{plan.focus}</p>}

              <div className="workout-plan-info">
                {plan.exercises.length} Exercises
                {plan.is_default && (
                  <span className="default-badge">Default</span>
                )}
              </div>

              <button
                className="primary-btn full-width"
                onClick={() => selectPlan(plan)}
              >
                Start Workout
              </button>

              {!plan.is_default && (
                <button
                  className="secondary-btn full-width"
                  onClick={() => deletePlan(plan.id)}
                  style={{ marginTop: 6 }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Plan preview ── */}
      {selectedPlan && (
        <div className="workout-preview">
          <div className="preview-header">
            <div>
              <h2>{selectedPlan.name}</h2>
              <p>{selectedPlan.focus}</p>
            </div>
            <button className="close-btn" onClick={closeWorkout}>
              ✕
            </button>
          </div>

          <div className="exercise-list">
            {selectedPlan.exercises.map((pe) => (
              <div className="exercise-row" key={pe.id}>
                <strong>{pe.exercise.name}</strong>
                <span>
                  {pe.target_sets} × {pe.target_reps}
                </span>
              </div>
            ))}
          </div>

          <button className="primary-btn" onClick={beginWorkout}>
            Begin Workout
          </button>
        </div>
      )}
    </div>
  );
}

export default Workout;
