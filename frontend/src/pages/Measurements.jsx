import { useState } from "react";

function Measurements() {
  const [measurements, setMeasurements] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
  });

  const handleChange = (e) => {
    setMeasurements({
      ...measurements,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Measurements:", measurements);
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Measurements</h1>
          <p>Track your body measurements and physical progress.</p>
        </div>
      </div>

      <div className="measurement-section">

        <h2>Current Measurements</h2>

        <div className="measurement-grid">

          <div className="measurement-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              value={measurements.weight}
              onChange={handleChange}
            />
          </div>

          <div className="measurement-field">
            <label>Chest (cm)</label>
            <input
              type="number"
              name="chest"
              placeholder="Enter chest"
              value={measurements.chest}
              onChange={handleChange}
            />
          </div>

          <div className="measurement-field">
            <label>Waist (cm)</label>
            <input
              type="number"
              name="waist"
              placeholder="Enter waist"
              value={measurements.waist}
              onChange={handleChange}
            />
          </div>

          <div className="measurement-field">
            <label>Hips (cm)</label>
            <input
              type="number"
              name="hips"
              placeholder="Enter hips"
              value={measurements.hips}
              onChange={handleChange}
            />
          </div>

          <div className="measurement-field">
            <label>Arms (cm)</label>
            <input
              type="number"
              name="arms"
              placeholder="Enter arms"
              value={measurements.arms}
              onChange={handleChange}
            />
          </div>

          <div className="measurement-field">
            <label>Thighs (cm)</label>
            <input
              type="number"
              name="thighs"
              placeholder="Enter thighs"
              value={measurements.thighs}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          className="measurement-save-button"
          onClick={handleSave}
        >
          Save Measurements
        </button>

      </div>

      <div className="measurement-section">

        <h2>Measurement History</h2>

        <div className="measurement-empty">
          <h3>No measurements recorded yet</h3>
          <p>
            Your measurement history will appear here once you start
            recording your measurements.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Measurements;
