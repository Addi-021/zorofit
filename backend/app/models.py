from datetime import date, datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    age = Column(Integer, nullable=True)
    sex = Column(String(20), nullable=True)
    height_cm = Column(Float, nullable=True)
    current_weight_kg = Column(Float, nullable=True)
    target_weight_kg = Column(Float, nullable=True)
    fitness_goal = Column(String(100), nullable=True)
    activity_level = Column(String(50), nullable=True)
    experience_level = Column(String(30), nullable=True)
    workout_days_per_week = Column(Integer, nullable=True)
    onboarding_completed = Column(
        Boolean, nullable=False, default=False, server_default="false"
    )

    user = relationship("User", back_populates="profile")


class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    recorded_on = Column(Date, nullable=False, default=date.today)
    weight_kg = Column(Float, nullable=True)
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    hips_cm = Column(Float, nullable=True)
    arms_cm = Column(Float, nullable=True)
    thighs_cm = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    entry_date = Column(Date, nullable=False, default=date.today)
    entry_type = Column(String(30), nullable=False, default="general")
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False, default="")
    pinned = Column(Boolean, nullable=False, default=False, server_default="false")
    mood = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


# ─── Workout Models ───────────────────────────────────────────────

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    muscle_group = Column(String(50), nullable=False)
    equipment = Column(String(50), nullable=False, default="Barbell")
    description = Column(Text, nullable=True)

    plan_exercises = relationship("PlanExercise", back_populates="exercise")


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,  # NULL = default/system plan
        index=True,
    )
    name = Column(String(150), nullable=False)
    focus = Column(String(200), nullable=True)
    duration_min = Column(Integer, nullable=True)
    is_default = Column(Boolean, nullable=False, default=False, server_default="false")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    plan_exercises = relationship(
        "PlanExercise",
        back_populates="plan",
        cascade="all, delete-orphan",
        order_by="PlanExercise.order",
    )
    logs = relationship("WorkoutLog", back_populates="plan")


class PlanExercise(Base):
    __tablename__ = "plan_exercises"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(
        Integer,
        ForeignKey("workout_plans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    exercise_id = Column(
        Integer,
        ForeignKey("exercises.id", ondelete="CASCADE"),
        nullable=False,
    )
    order = Column(Integer, nullable=False, default=0)
    target_sets = Column(Integer, nullable=False, default=3)
    target_reps = Column(Integer, nullable=False, default=10)

    plan = relationship("WorkoutPlan", back_populates="plan_exercises")
    exercise = relationship("Exercise", back_populates="plan_exercises")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_id = Column(
        Integer,
        ForeignKey("workout_plans.id", ondelete="SET NULL"),
        nullable=True,
    )
    started_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    plan = relationship("WorkoutPlan", back_populates="logs")
    sets = relationship(
        "WorkoutLogSet",
        back_populates="log",
        cascade="all, delete-orphan",
        order_by="WorkoutLogSet.id",
    )


class WorkoutLogSet(Base):
    __tablename__ = "workout_log_sets"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(
        Integer,
        ForeignKey("workout_logs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    exercise_id = Column(
        Integer,
        ForeignKey("exercises.id", ondelete="CASCADE"),
        nullable=False,
    )
    set_number = Column(Integer, nullable=False)
    weight_kg = Column(Float, nullable=True)
    reps = Column(Integer, nullable=True)

    log = relationship("WorkoutLog", back_populates="sets")
    exercise = relationship("Exercise")
