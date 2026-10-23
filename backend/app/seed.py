"""
Seed the database with exercises and default workout plans.

Run from the backend directory:
    python -m app.seed
"""

from sqlalchemy import select
from app.database import SessionLocal
from app.models import Exercise, PlanExercise, WorkoutPlan


EXERCISES = [
    # ── Chest ──
    {"name": "Flat Barbell Bench Press", "muscle_group": "Chest", "equipment": "Barbell"},
    {"name": "Incline Dumbbell Press", "muscle_group": "Chest", "equipment": "Dumbbell"},
    {"name": "Dumbbell Flyes", "muscle_group": "Chest", "equipment": "Dumbbell"},
    {"name": "Cable Crossover", "muscle_group": "Chest", "equipment": "Cable"},
    {"name": "Push-ups", "muscle_group": "Chest", "equipment": "Bodyweight"},
    {"name": "Decline Bench Press", "muscle_group": "Chest", "equipment": "Barbell"},

    # ── Back ──
    {"name": "Barbell Row", "muscle_group": "Back", "equipment": "Barbell"},
    {"name": "Pull-ups", "muscle_group": "Back", "equipment": "Bodyweight"},
    {"name": "Lat Pulldown", "muscle_group": "Back", "equipment": "Cable"},
    {"name": "Seated Cable Row", "muscle_group": "Back", "equipment": "Cable"},
    {"name": "Dumbbell Row", "muscle_group": "Back", "equipment": "Dumbbell"},
    {"name": "Deadlift", "muscle_group": "Back", "equipment": "Barbell"},
    {"name": "Face Pulls", "muscle_group": "Back", "equipment": "Cable"},

    # ── Shoulders ──
    {"name": "Overhead Press", "muscle_group": "Shoulders", "equipment": "Barbell"},
    {"name": "Dumbbell Shoulder Press", "muscle_group": "Shoulders", "equipment": "Dumbbell"},
    {"name": "Lateral Raises", "muscle_group": "Shoulders", "equipment": "Dumbbell"},
    {"name": "Front Raises", "muscle_group": "Shoulders", "equipment": "Dumbbell"},
    {"name": "Rear Delt Flyes", "muscle_group": "Shoulders", "equipment": "Dumbbell"},

    # ── Arms ──
    {"name": "Barbell Curl", "muscle_group": "Arms", "equipment": "Barbell"},
    {"name": "Dumbbell Curl", "muscle_group": "Arms", "equipment": "Dumbbell"},
    {"name": "Hammer Curl", "muscle_group": "Arms", "equipment": "Dumbbell"},
    {"name": "Tricep Pushdown", "muscle_group": "Arms", "equipment": "Cable"},
    {"name": "Skull Crushers", "muscle_group": "Arms", "equipment": "Barbell"},
    {"name": "Overhead Tricep Extension", "muscle_group": "Arms", "equipment": "Dumbbell"},
    {"name": "Dips", "muscle_group": "Arms", "equipment": "Bodyweight"},

    # ── Legs ──
    {"name": "Barbell Squat", "muscle_group": "Legs", "equipment": "Barbell"},
    {"name": "Leg Press", "muscle_group": "Legs", "equipment": "Machine"},
    {"name": "Romanian Deadlift", "muscle_group": "Legs", "equipment": "Barbell"},
    {"name": "Leg Curl", "muscle_group": "Legs", "equipment": "Machine"},
    {"name": "Leg Extension", "muscle_group": "Legs", "equipment": "Machine"},
    {"name": "Bulgarian Split Squat", "muscle_group": "Legs", "equipment": "Dumbbell"},
    {"name": "Calf Raises", "muscle_group": "Legs", "equipment": "Machine"},
    {"name": "Lunges", "muscle_group": "Legs", "equipment": "Dumbbell"},

    # ── Core ──
    {"name": "Plank", "muscle_group": "Core", "equipment": "Bodyweight"},
    {"name": "Hanging Leg Raise", "muscle_group": "Core", "equipment": "Bodyweight"},
    {"name": "Cable Crunch", "muscle_group": "Core", "equipment": "Cable"},
    {"name": "Russian Twist", "muscle_group": "Core", "equipment": "Bodyweight"},
]


def _get_or_create_exercise(db, name: str) -> Exercise:
    ex = db.scalar(select(Exercise).where(Exercise.name == name))
    if ex is None:
        raise ValueError(f"Exercise '{name}' not found – seed exercises first")
    return ex


DEFAULT_PLANS = [
    {
        "name": "Push Day",
        "focus": "Chest, Shoulders, Triceps",
        "duration_min": 60,
        "exercises": [
            ("Flat Barbell Bench Press", 4, 10),
            ("Incline Dumbbell Press", 3, 12),
            ("Cable Crossover", 3, 15),
            ("Overhead Press", 4, 8),
            ("Lateral Raises", 3, 15),
            ("Tricep Pushdown", 3, 12),
            ("Overhead Tricep Extension", 3, 12),
        ],
    },
    {
        "name": "Pull Day",
        "focus": "Back, Biceps",
        "duration_min": 60,
        "exercises": [
            ("Deadlift", 4, 6),
            ("Barbell Row", 4, 10),
            ("Lat Pulldown", 3, 12),
            ("Seated Cable Row", 3, 12),
            ("Face Pulls", 3, 15),
            ("Barbell Curl", 3, 10),
            ("Hammer Curl", 3, 12),
        ],
    },
    {
        "name": "Leg Day",
        "focus": "Quads, Hamstrings, Glutes, Calves",
        "duration_min": 75,
        "exercises": [
            ("Barbell Squat", 4, 8),
            ("Leg Press", 3, 12),
            ("Romanian Deadlift", 4, 10),
            ("Leg Extension", 3, 15),
            ("Leg Curl", 3, 12),
            ("Bulgarian Split Squat", 3, 10),
            ("Calf Raises", 4, 15),
            ("Hanging Leg Raise", 3, 15),
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        # ── Seed exercises ──
        existing_names = set(db.scalars(select(Exercise.name)).all())
        added = 0
        for ex_data in EXERCISES:
            if ex_data["name"] not in existing_names:
                db.add(Exercise(**ex_data))
                added += 1
        db.commit()
        print(f"Exercises: {added} added, {len(existing_names)} already existed.")

        # ── Seed default plans ──
        existing_plans = set(
            db.scalars(
                select(WorkoutPlan.name).where(WorkoutPlan.is_default == True)  # noqa: E712
            ).all()
        )
        plans_added = 0
        for plan_data in DEFAULT_PLANS:
            if plan_data["name"] in existing_plans:
                continue

            plan = WorkoutPlan(
                user_id=None,
                name=plan_data["name"],
                focus=plan_data["focus"],
                duration_min=plan_data["duration_min"],
                is_default=True,
            )

            for i, (ex_name, sets, reps) in enumerate(plan_data["exercises"]):
                ex = _get_or_create_exercise(db, ex_name)
                plan.plan_exercises.append(
                    PlanExercise(
                        exercise_id=ex.id,
                        order=i,
                        target_sets=sets,
                        target_reps=reps,
                    )
                )

            db.add(plan)
            plans_added += 1

        db.commit()
        print(f"Default plans: {plans_added} added, {len(existing_plans)} already existed.")
        print("Seed complete!")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
