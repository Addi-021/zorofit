from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from typing import Literal, Optional
class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    created_at: datetime | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProfileUpdate(BaseModel):
    age: int | None = Field(default=None, ge=1, le=120)
    sex: str | None = Field(default=None, max_length=20)
    height_cm: float | None = Field(default=None, gt=0, lt=300)
    current_weight_kg: float | None = Field(default=None, gt=0, lt=500)
    target_weight_kg: float | None = Field(default=None, gt=0, lt=500)
    fitness_goal: str | None = Field(default=None, max_length=100)
    activity_level: str | None = Field(default=None, max_length=50)
    experience_level: str | None = Field(default=None, max_length=30)
    workout_days_per_week: int | None = Field(default=None, ge=1, le=7)
    onboarding_completed: bool | None = None


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    age: int | None = None
    sex: str | None = None
    height_cm: float | None = None
    current_weight_kg: float | None = None
    target_weight_kg: float | None = None
    fitness_goal: str | None = None
    activity_level: str | None = None
    experience_level: str | None = None
    workout_days_per_week: int | None = None
    onboarding_completed: bool = False


class MeasurementCreate(BaseModel):
    recorded_on: date | None = None
    weight_kg: float | None = Field(default=None, gt=0, lt=500)
    chest_cm: float | None = Field(default=None, gt=0, lt=300)
    waist_cm: float | None = Field(default=None, gt=0, lt=300)
    hips_cm: float | None = Field(default=None, gt=0, lt=300)
    arms_cm: float | None = Field(default=None, gt=0, lt=100)
    thighs_cm: float | None = Field(default=None, gt=0, lt=200)


class MeasurementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_on: date
    weight_kg: float | None = None
    chest_cm: float | None = None
    waist_cm: float | None = None
    hips_cm: float | None = None
    arms_cm: float | None = None
    thighs_cm: float | None = None

EntryType = Literal["workout", "nutrition", "mood", "general"]


class JournalCreate(BaseModel):
    entry_date: date | None = None
    entry_type: EntryType = "general"
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(default="", max_length=20000)
    mood: str | None = Field(default=None, max_length=20)
    pinned: bool = False


class JournalUpdate(BaseModel):
    entry_date: date | None = None
    entry_type: EntryType | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, max_length=20000)
    mood: str | None = Field(default=None, max_length=20)
    pinned: bool | None = None


class JournalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entry_date: date
    entry_type: str
    title: str
    content: str
    mood: str | None = None
    pinned: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


# ─── Exercise Schemas ─────────────────────────────────────────────

class ExerciseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    muscle_group: str
    equipment: str
    description: str | None = None


# ─── Workout Plan Schemas ─────────────────────────────────────────

class PlanExerciseIn(BaseModel):
    exercise_id: int
    order: int = 0
    target_sets: int = Field(default=3, ge=1, le=20)
    target_reps: int = Field(default=10, ge=1, le=100)


class PlanExerciseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    exercise_id: int
    order: int
    target_sets: int
    target_reps: int
    exercise: ExerciseOut


class WorkoutPlanCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    focus: str | None = Field(default=None, max_length=200)
    duration_min: int | None = Field(default=None, ge=1, le=300)
    exercises: list[PlanExerciseIn] = Field(default_factory=list)


class WorkoutPlanUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    focus: str | None = Field(default=None, max_length=200)
    duration_min: int | None = Field(default=None, ge=1, le=300)
    exercises: list[PlanExerciseIn] | None = None


class WorkoutPlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    focus: str | None = None
    duration_min: int | None = None
    is_default: bool = False
    exercises: list[PlanExerciseOut] = Field(
        default_factory=list, alias="plan_exercises"
    )


# ─── Workout Log Schemas ──────────────────────────────────────────

class LogSetIn(BaseModel):
    exercise_id: int
    set_number: int = Field(ge=1)
    weight_kg: float | None = Field(default=None, ge=0)
    reps: int | None = Field(default=None, ge=0)


class LogSetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    exercise_id: int
    set_number: int
    weight_kg: float | None = None
    reps: int | None = None
    exercise: ExerciseOut


class WorkoutLogCreate(BaseModel):
    plan_id: int | None = None
    notes: str | None = Field(default=None, max_length=5000)
    sets: list[LogSetIn] = Field(default_factory=list)


class WorkoutLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plan_id: int | None = None
    started_at: datetime
    completed_at: datetime | None = None
    notes: str | None = None
    sets: list[LogSetOut] = []
