import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  recorded_on: new Date().toISOString().slice(0, 10),
  weight_kg: "",
  chest_cm: "",
  waist_cm: "",
  hips_cm: "",
  arms_cm: "",
  thighs_cm: "",
};

const fields = [
  { name: "weight_kg", label: "Weight (kg)" },
  { name: "chest_cm", label: "Chest (cm)" },
  { name: "waist_cm", label: "Waist (cm)" },
  { name: "hips_cm", label: "Hips (cm)" },
  { name: "arms_cm", label: "Arms (cm)" },
  { name: "thighs_cm", label: "Thighs (cm)" },
];

function Measurements() {
  const [form, setForm] = useState(emptyForm);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadHistory() {
    try {
      setHistory(await api("/measurements"));
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    api("/measurements")
      .then(setHistory)
      .catch((err) => setMessage(err.message));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const body = { recorded_on: form.recorded_on || null };
    fields.forEach((f) => {
      body[f.name] = form[f.name] ? Number(form[f.name]) : null;
    });

    try {
      await api("/measurements", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setForm({ ...emptyForm, recorded_on: form.recorded_on });
      setMessage("Measurements saved.");
      await loadHistory();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/measurements/${id}`, { method: "DELETE" });
      await loadHistory();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const show = (value) => (value === null || value === undefined ? "—" : value);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Measurements</h1>
          <p>Track your body measurements and physical progress.</p>
        </div>
      </div>

      <div className="measurement-section">
        <h2>Add Measurements</h2>

        <div className="measurement-grid">
          <div className="measurement-field">
            <label>Date</label>
            <input
              type="date"
              name="recorded_on"
              value={form.recorded_on}
              onChange={handleChange}
            />
          </div>

          {fields.map((f) => (
            <div className="measurement-field" key={f.name}>
              <label>{f.label}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name={f.name}
                placeholder="Optional"
                value={form[f.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <button
          className="measurement-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Measurements"}
        </button>

        {message && <p className="profile-notice">{message}</p>}
      </div>

      <div className="measurement-section">
        <h2>Measurement History</h2>

        {history.length === 0 ? (
          <div className="measurement-empty">
            <h3>No measurements recorded yet</h3>
            <p>
              Your measurement history will appear here once you start
              recording your measurements.
            </p>
          </div>
        ) : (
          <div className="history-table">
            <div className="history-row history-head">
              <span>Date</span>
              <span>Weight</span>
              <span>Chest</span>
              <span>Waist</span>
              <span>Hips</span>
              <span>Arms</span>
              <span>Thighs</span>
              <span></span>
            </div>

            {history.map((m) => (
              <div className="history-row" key={m.id}>
                <span>{m.recorded_on}</span>
                <span>{show(m.weight_kg)}</span>
                <span>{show(m.chest_cm)}</span>
                <span>{show(m.waist_cm)}</span>
                <span>{show(m.hips_cm)}</span>
                <span>{show(m.arms_cm)}</span>
                <span>{show(m.thighs_cm)}</span>
                <button
                  className="history-delete"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Measurements;
