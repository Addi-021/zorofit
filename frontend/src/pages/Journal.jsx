/* eslint-disable react-hooks/refs */

import { useEffect, useRef, useState } from "react";
import { api } from "../api";


const types = [
  { key: "all", label: "All" },
  { key: "workout", label: "Workout" },
  { key: "nutrition", label: "Nutrition" },
  { key: "mood", label: "Mood" },
  { key: "general", label: "General" },
];

const moods = [
  { key: "strong", emoji: "💪" },
  { key: "happy", emoji: "😊" },
  { key: "neutral", emoji: "😐" },
  { key: "tired", emoji: "😴" },
  { key: "sore", emoji: "🤕" },
];

const moodEmoji = Object.fromEntries(moods.map((m) => [m.key, m.emoji]));

const templates = [
  { key: "blank", label: "Blank entry", title: "Untitled", type: "general", content: "" },
  {
    key: "workout",
    label: "Workout log",
    title: "Workout log",
    type: "workout",
    content:
      "Exercises:\n- \n\nSets / reps / weight:\n- \n\nHow it felt:\n",
  },
  {
    key: "meal",
    label: "Meal log",
    title: "Meal log",
    type: "nutrition",
    content:
      "Breakfast:\n- \n\nLunch:\n- \n\nDinner:\n- \n\nSnacks:\n- \n\nWater:\n",
  },
  {
    key: "reflection",
    label: "Daily reflection",
    title: "Daily reflection",
    type: "mood",
    content: "Wins today:\n- \n\nStruggles:\n- \n\nGoal for tomorrow:\n",
  },
];

const localDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseUtc = (value) =>
  new Date(/Z|[+-]\d\d:?\d\d$/.test(value) ? value : value + "Z");

const prettyDate = (value) =>
  new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toForm = (e) => ({
  title: e.title,
  content: e.content,
  entry_type: e.entry_type,
  entry_date: e.entry_date,
  mood: e.mood || "",
});

const sortEntries = (list) =>
  [...list].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.entry_date.localeCompare(a.entry_date) ||
      b.id - a.id
  );

const preview = (text) => text.replace(/\s+/g, " ").trim().slice(0, 70);

const saveLabels = {
  idle: "",
  editing: "Unsaved changes...",
  saving: "Saving...",
  saved: "Saved",
  error: "Could not save",
};

function Journal() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [todayStr] = useState(() => localDate());
  const [yesterdayStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return localDate(d);
  });

  const formRef = useRef(null);
  const idRef = useRef(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);

  async function saveNow() {
    clearTimeout(timerRef.current);
    if (!dirtyRef.current || !idRef.current) return;

    dirtyRef.current = false;
    setSaveState("saving");

    try {
      const f = formRef.current;
      const saved = await api(`/journal/${idRef.current}`, {
        method: "PUT",
        body: JSON.stringify({
          title: f.title.trim() || "Untitled",
          content: f.content,
          entry_type: f.entry_type,
          entry_date: f.entry_date,
          mood: f.mood || null,
        }),
      });
      setEntries((list) => list.map((e) => (e.id === saved.id ? saved : e)));
      setSaveState("saved");
    } catch (err) {
      dirtyRef.current = true;
      setSaveState("error");
      setMessage(err.message);
    }
  }

  function setCurrent(entry) {
    idRef.current = entry ? entry.id : null;
    formRef.current = entry ? toForm(entry) : null;
    dirtyRef.current = false;
    setSelectedId(idRef.current);
    setForm(formRef.current);
    setSaveState("idle");
    setMessage("");
  }

  async function leaveCurrent(nextId) {
    await saveNow();

    const f = formRef.current;
    const id = idRef.current;
    const title = f ? f.title.trim() : "";

    if (id && id !== nextId && f && (title === "Untitled" || title === "") && !f.content.trim()) {
      try {
        await api(`/journal/${id}`, { method: "DELETE" });
        setEntries((list) => list.filter((e) => e.id !== id));
      } catch {
        // an empty draft that could not be removed is harmless
      }
    }
  }

  useEffect(() => {
    api("/journal")
      .then((list) => {
        setEntries(list);
        const first = sortEntries(list)[0];
        if (first) {
          idRef.current = first.id;
          formRef.current = toForm(first);
          setSelectedId(first.id);
          setForm(formRef.current);
        }
      })
      .catch((err) => setMessage(err.message));
  }, []);

  useEffect(() => {
    return () => {
      if (dirtyRef.current) saveNow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setField(name, value) {
    const next = { ...formRef.current, [name]: value };
    formRef.current = next;
    dirtyRef.current = true;
    setForm(next);
    setSaveState("editing");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(saveNow, 800);
  }

  async function openEntry(entry) {
    if (entry.id === idRef.current) return;
    await leaveCurrent(entry.id);
    setCurrent(entry);
  }

  async function createEntry(tpl) {
    setShowTemplates(false);
    await leaveCurrent(null);

    try {
      const created = await api("/journal", {
        method: "POST",
        body: JSON.stringify({
          title: tpl.title,
          entry_type: tpl.type,
          content: tpl.content,
          entry_date: todayStr,
        }),
      });
      setEntries((list) => [created, ...list]);
      setCurrent(created);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function togglePin(entry) {
    try {
      const saved = await api(`/journal/${entry.id}`, {
        method: "PUT",
        body: JSON.stringify({ pinned: !entry.pinned }),
      });
      setEntries((list) => list.map((e) => (e.id === saved.id ? saved : e)));
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function removeEntry() {
    const id = idRef.current;
    if (!id) return;
    if (!window.confirm("Delete this entry?")) return;

    clearTimeout(timerRef.current);
    dirtyRef.current = false;

    try {
      await api(`/journal/${id}`, { method: "DELETE" });
      const rest = entries.filter((e) => e.id !== id);
      setEntries(rest);
      setCurrent(sortEntries(rest)[0] || null);
    } catch (err) {
      setMessage(err.message);
    }
  }

  const query = search.trim().toLowerCase();

  const visible = sortEntries(entries)
    .filter((e) => filter === "all" || e.entry_type === filter)
    .filter(
      (e) =>
        !query ||
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
    );

  const groups = [];
  visible.forEach((e) => {
    const label = e.pinned
      ? "Pinned"
      : e.entry_date === todayStr
      ? "Today"
      : e.entry_date === yesterdayStr
      ? "Yesterday"
      : "Earlier";

    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(e);
    } else {
      groups.push({ label, items: [e] });
    }
  });

  const selected = entries.find((e) => e.id === selectedId);
  const words = form && form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Journal</h1>
          <p>Log your sessions, meals and how you feel.</p>
        </div>

        <div className="template-wrap">
          <button
            className="primary-btn"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            + New Entry
          </button>

          {showTemplates && (
            <div className="template-menu">
              {templates.map((t) => (
                <button key={t.key} onClick={() => createEntry(t)}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && <p className="profile-notice">{message}</p>}

      <div className="metric-tabs">
        {types.map((t) => (
          <button
            key={t.key}
            className={`metric-tab ${filter === t.key ? "active" : ""}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="journal-layout">
        <div className="journal-side">
          <input
            className="journal-search"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="journal-list">
            {visible.length === 0 ? (
              <div className="journal-empty">
                {entries.length === 0
                  ? "No entries yet. Click + New Entry to start."
                  : "No entries match your search."}
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.label}>
                  <div className="journal-group-title">{g.label}</div>

                  {g.items.map((entry) => (
                    <div className="journal-row" key={entry.id}>
                      <button
                        className={`journal-item ${
                          entry.id === selectedId ? "active" : ""
                        }`}
                        onClick={() =>openEntry(entry)}
                      >
                        <strong>
                          {entry.mood && moodEmoji[entry.mood]
                            ? `${moodEmoji[entry.mood]} `
                            : ""}
                          {entry.title}
                        </strong>
                        <span>
                          {prettyDate(entry.entry_date)} · {entry.entry_type}
                        </span>
                        {preview(entry.content) && (
                          <p className="journal-preview">
                            {preview(entry.content)}
                          </p>
                        )}
                      </button>

                      <button
                        className={`pin-btn ${entry.pinned ? "on" : ""}`}
                        title={entry.pinned ? "Unpin" : "Pin to top"}
                        onClick={() => togglePin(entry)}
                      >
                        📌
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {form ? (
          <div className="journal-editor">
            <input
              className="journal-title"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />

            <div className="journal-meta">
              <select
                value={form.entry_type}
                onChange={(e) => setField("entry_type", e.target.value)}
              >
                <option value="workout">Workout</option>
                <option value="nutrition">Nutrition</option>
                <option value="mood">Mood</option>
                <option value="general">General</option>
              </select>

              <input
                type="date"
                value={form.entry_date}
                onChange={(e) => setField("entry_date", e.target.value)}
              />
            </div>

            <div className="mood-picker">
              <span>Mood</span>
              {moods.map((m) => (
                <button
                  key={m.key}
                  className={form.mood === m.key ? "on" : ""}
                  onClick={() =>
                    setField("mood", form.mood === m.key ? "" : m.key)
                  }
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            <textarea
              placeholder="How did the session go? What did you eat? How do you feel?"
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
            />

            <div className="journal-footer">
              <span>
                {words} {words === 1 ? "word" : "words"}
                {selected && selected.updated_at
                  ? ` · Edited ${parseUtc(selected.updated_at).toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}`
                  : ""}
              </span>

              <span className={`save-state ${saveState}`}>
                {saveLabels[saveState]}
              </span>

              <button className="history-delete" onClick={removeEntry}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="journal-editor journal-placeholder">
            Select an entry on the left, or click + New Entry to start writing.
          </div>
        )}
      </div>
    </div>
  );
}

export default Journal;
