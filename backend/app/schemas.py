from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


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
    height_cm: float | None = Field(default=None, gt=0, lt=300)
    current_weight_kg: float | None = Field(default=None, gt=0, lt=500)
    target_weight_kg: float | None = Field(default=None, gt=0, lt=500)
    fitness_goal: str | None = Field(default=None, max_length=100)
    activity_level: str | None = Field(default=None, max_length=50)


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    age: int | None = None
    height_cm: float | None = None
    current_weight_kg: float | None = None
    target_weight_kg: float | None = None
    fitness_goal: str | None = None
    activity_level: str | None = None


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
