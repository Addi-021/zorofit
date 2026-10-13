
import { useState } from "react";

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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Profile details:", profile);
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
            <input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
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

        <button className="profile-save-button" type="submit">
          Save Profile
        </button>
      </form>

      <p className="profile-notice">
        Profile details are not saved permanently yet.
        Backend integration will be added later.
      </p>
    </div>
  );
}

export default Profile;
