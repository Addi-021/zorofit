from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from typing import Literal
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


class JournalUpdate(BaseModel):
    entry_date: date | None = None
    entry_type: EntryType | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, max_length=20000)


class JournalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entry_date: date
    entry_type: EntryType
    title: str
    content: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
