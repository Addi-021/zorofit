import { Link, Navigate } from "react-router-dom";
import { getToken } from "../api";
import "./Landing.css";


const allQuotes = [
  { text: "Small steps every day beat big plans someday.", tag: "Consistency" },
  { text: "You don't have to be extreme, just consistent.", tag: "Consistency" },
  { text: "Show up first. Motivation catches up later.", tag: "Mindset" },
  { text: "Progress is quiet. Keep going anyway.", tag: "Mindset" },
  { text: "Strong is built one rep at a time.", tag: "Strength" },
  { text: "Your only competition is who you were yesterday.", tag: "Growth" },
  { text: "Rest is part of the plan, not a break from it.", tag: "Recovery" },
  { text: "Eat well, move daily, sleep enough. Repeat.", tag: "Habits" },
  { text: "The best workout is the one you actually do.", tag: "Action" },
  { text: "Track it, improve it, repeat it.", tag: "Progress" },
  { text: "Discipline is a promise you keep to yourself.", tag: "Discipline" },
  { text: "A tough day at the gym still beats a day on the couch.", tag: "Effort" },
];

function pickQuotes(count) {
  const pool = [...allQuotes];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

// Runs once when the page loads, so every refresh shows a new set.
const todaysQuotes = pickQuotes(4);

const marquee = [
  "Strength",
  "Discipline",
  "Cardio",
  "Nutrition",
  "Journal",
  "Recovery",
  "Consistency",
  "Progress",
];

const quickLinks = [
  { icon: "🏋️", label: "Track Workouts" },
  { icon: "🍎", label: "Log Nutrition" },
  { icon: "📓", label: "Take Journal" },
  { icon: "📈", label: "Track Progress" },
];

const features = [
  {
    icon: "🏋️",
    title: "Track Workouts",
    text: "Log exercises, sets and reps, and see your training history build up.",
  },
  {
    icon: "🔥",
    title: "Count Calories",
    text: "Follow your daily calories and macros with real food data.",
  },
    {
    icon: "📓",
    title: "Journal",
    text: "Record your sessions, meals and mood to see what is really working.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    text: "See your weight and body measurements change over time.",
  },
];

const steps = [
  { n: "01", title: "Create your account", text: "Sign up in under a minute." },
  { n: "02", title: "Set up your profile", text: "Tell us your goal, body stats and training habits." },
  { n: "03", title: "Track and improve", text: "Log daily, watch your progress, stay consistent." },
];

function Landing() {
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-logo">
          Zoro<span>Fit</span>
        </div>

        <nav className="lp-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn lp-btn-outline">Login</Link>
          <Link to="/register" className="lp-btn lp-btn-solid">Get Started</Link>
        </div>
      </header>

      <section className="lp-hero" id="home">
               <div className="lp-hero-text">
          <p className="lp-eyebrow">TRACK. JOURNAL. BECOME BETTER.</p>
          <h1>
            Discipline yourself. <span>Push past your limits.</span>
          </h1>
          <p className="lp-sub">
            ZoroFit helps you track your workouts and nutrition, journal every
            session, and build the discipline to become the better version of
            yourself.
          </p>

          <div className="lp-hero-buttons">
            <Link to="/register" className="lp-btn lp-btn-solid lp-btn-big">
              Get Started →
            </Link>
            <a href="#features" className="lp-btn lp-btn-outline lp-btn-big">
              Explore Features
            </a>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-float lp-float-1">
            <span>Workouts</span>
            <strong>12</strong>
            <small>This month</small>
          </div>

          <div className="lp-float lp-float-2">
            <span>Calories</span>
            <strong>2,340</strong>
            <small>Avg / day</small>
          </div>

          <div className="lp-float lp-float-3">
            <span>Weight</span>
            <strong>-3.2 kg</strong>
            <small>This month</small>
          </div>
        </div>
      </section>

      <div className="lp-quick">
        {quickLinks.map((q) => (
          <div className="lp-quick-item" key={q.label}>
            <span>{q.icon}</span>
            {q.label}
          </div>
        ))}
      </div>

      <div className="lp-marquee">
        <div className="lp-marquee-track">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((word, i) => (
            <span key={i}>
              {word} <i>●</i>
            </span>
          ))}
        </div>
      </div>

      <section className="lp-quotes">
        <p className="lp-eyebrow">WORDS TO TRAIN BY</p>
        <h2>Keep showing up.</h2>

        <div className="lp-quote-grid">
          {todaysQuotes.map((q) => (
            <div className="lp-quote" key={q.text}>
              <div className="lp-quote-mark">“</div>
              <p>{q.text}</p>
              <span>{q.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-features" id="features">
        <p className="lp-eyebrow">EVERYTHING IN ONE PLACE</p>
        <h2>Your fitness, simplified.</h2>

        <div className="lp-feature-grid">
          {features.map((f) => (
            <div className="lp-card" key={f.title}>
              <div className="lp-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-steps">
        {steps.map((s) => (
          <div className="lp-step" key={s.n}>
            <strong>{s.n}</strong>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </section>

      <section className="lp-cta" id="about">
               <h2>
          Become the better version of <span>yourself.</span>
        </h2>
        <p>Track it. Journal it.</p>
        <Link to="/register" className="lp-btn lp-btn-solid lp-btn-big">
          Start Your Journey →
        </Link>
      </section>

      <footer className="lp-footer">
        <div className="lp-logo">
          Zoro<span>Fit</span>
        </div>
        <span>© 2026 ZoroFit</span>
      </footer>
    </div>
  );
}

export default Landing;
