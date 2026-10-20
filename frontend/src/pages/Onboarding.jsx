import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { api } from "../api";

function Onboarding() {
  const navigate = useNavigate();
  const { markDone } = useOutletContext();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    age: "",
    sex: "",
    height: "",
    weight: "",
    goal: "",
    targetWeight: "",
    activityLevel: "",
    experience: "",
    days: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => {
    setError("");
    if (step === 1 && (!form.age || !form.height || !form.weight)) {
      setError("Please enter your age, height and weight.");
      return;
    }
    if (step === 2 && !form.goal) {
      setError("Please choose a goal.");
      return;
    }
    setStep(step + 1);
  };

  const finish = async () => {
    setSaving(true);
    setError("");

    const num = (v) => (v ? Number(v) : null);

    try {
      await api("/users/me/profile", {
        method: "PUT",
        body: JSON.stringify({
          age: num(form.age),
          sex: form.sex || null,
          height_cm: num(form.height),
          current_weight_kg: num(form.weight),
          fitness_goal: form.goal || null,
          target_weight_kg: num(form.targetWeight),
          activity_level: form.activityLevel || null,
          experience_level: form.experience || null,
          workout_days_per_week: num(form.days),
          onboarding_completed: true,
        }),
      });

      if (form.weight) {
        await api("/measurements", {
          method: "POST",
          body: JSON.stringify({ weight_kg: Number(form.weight) }),
        });
      }

      markDone();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card onboarding-card">
        <div className="onboarding-steps">Step {step} of 3</div>

        {step === 1 && (
          <>
            <h1>About you</h1>
            <p>This helps us personalise your plan.</p>

            <input
              name="age"
              type="number"
              min="1"
              max="120"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />

            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="">Sex (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="height"
              type="number"
              min="1"
              placeholder="Height (cm)"
              value={form.height}
              onChange={handleChange}
            />

            <input
              name="weight"
              type="number"
              min="1"
              step="0.1"
              placeholder="Current weight (kg)"
              value={form.weight}
              onChange={handleChange}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1>Your goal</h1>
            <p>What do you want to achieve?</p>

            <select name="goal" value={form.goal} onChange={handleChange}>
              <option value="">Select your goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Weight Maintenance</option>
              <option value="general-fitness">General Fitness</option>
            </select>

            <input
              name="targetWeight"
              type="number"
              min="1"
              step="0.1"
              placeholder="Target weight (kg, optional)"
              value={form.targetWeight}
              onChange={handleChange}
            />

            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
            >
              <option value="">Daily activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <h1>Your training</h1>
            <p>Tell us how you work out.</p>

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
            >
              <option value="">Experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select name="days" value={form.days} onChange={handleChange}>
              <option value="">Workout days per week</option>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </>
        )}

        {error && <div className="auth-error">{error}</div>}

        <div className="onboarding-buttons">
          {step > 1 && (
            <button className="secondary-btn" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}

          {step < 3 ? (
            <button className="primary-btn" onClick={next}>
              Next
            </button>
          ) : (
            <button className="primary-btn" onClick={finish} disabled={saving}>
              {saving ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
