import { useEffect, useState } from "react";
import { api } from "../api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    activityLevel: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [user, p] = await Promise.all([
          api("/users/me"),
          api("/users/me/profile"),
        ]);
                setProfile((prev) => ({
          ...prev,
          name: user.name,
          age: p.age ?? "",
          height: p.height_cm ?? "",
          weight: p.current_weight_kg ?? "",
          targetWeight: p.target_weight_kg ?? "",
          goal: p.fitness_goal ?? "",
          activityLevel: p.activity_level ?? "",
        }));
      } catch (err) {
        setMessage(err.message);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api("/users/me/profile", {
        method: "PUT",
         body: JSON.stringify({
          age: profile.age ? Number(profile.age) : null,
          height_cm: profile.height ? Number(profile.height) : null,
          current_weight_kg: profile.weight ? Number(profile.weight) : null,
          target_weight_kg: profile.targetWeight
            ? Number(profile.targetWeight)
            : null,
          fitness_goal: profile.goal || null,
          activity_level: profile.activityLevel || null,
        }),
      });
      setMessage("Profile saved.");
    } catch(err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal details and fitness goals.</p>
        </div>
      </div>

      <form className="profile-section" onSubmit={handleSave}>
        <h2>Personal Information</h2>

        <div className="profile-grid">
          <div className="profile-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={profile.name} readOnly />
          </div>

          <div className="profile-field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              value={profile.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              name="height"
              type="number"
              min="1"
              value={profile.height}
              onChange={handleChange}
              placeholder="Enter height"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="weight">Current Weight (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="1"
              step="0.1"
              value={profile.weight}
              onChange={handleChange}
              placeholder="Enter weight"
            />
          </div>
        </div>

        <h2 className="profile-subheading">Fitness Goals</h2>

        <div className="profile-grid">
          <div className="profile-field">
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              id="targetWeight"
              name="targetWeight"
              type="number"
              min="1"
              step="0.1"
              value={profile.targetWeight}
              onChange={handleChange}
              placeholder="Enter target weight"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="goal">Primary Goal</label>
            <select
              id="goal"
              name="goal"
              value={profile.goal}
              onChange={handleChange}
            >
              <option value="">Select your goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Weight Maintenance</option>
              <option value="general-fitness">General Fitness</option>
            </select>
          </div>

          <div className="profile-field">
            <label htmlFor="activityLevel">Activity Level</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>
        </div>

        <button className="profile-save-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {message && <p className="profile-notice">{message}</p>}
      <p className="profile-notice">
        Height, weight and goal are saved to your account. Age, target weight
        and activity level will be saved after the next database update.
      </p>
    </div>
  );
}

export default Profile;
