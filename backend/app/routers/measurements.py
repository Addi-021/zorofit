from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Measurement, User, UserProfile
from app.schemas import MeasurementCreate, MeasurementOut

router = APIRouter(prefix="/measurements", tags=["measurements"])


@router.post("", response_model=MeasurementOut, status_code=status.HTTP_201_CREATED)
def create_measurement(
    data: MeasurementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    values = data.model_dump(exclude={"recorded_on"})
    if all(v is None for v in values.values()):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Enter at least one measurement",
        )

    measurement = Measurement(
        user_id=current_user.id,
        recorded_on=data.recorded_on or date.today(),
        **values,
    )
    db.add(measurement)

    if data.weight_kg is not None:
        if current_user.profile is None:
            current_user.profile = UserProfile()
        current_user.profile.current_weight_kg = data.weight_kg

    db.commit()
    db.refresh(measurement)
    return measurement


@router.get("", response_model=list[MeasurementOut])
def list_measurements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Measurement)
        .where(Measurement.user_id == current_user.id)
        .order_by(Measurement.recorded_on.desc(), Measurement.id.desc())
    )
    return db.scalars(stmt).all()


@router.delete("/{measurement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_measurement(
    measurement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    measurement = db.get(Measurement, measurement_id)
    if measurement is None or measurement.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Measurement not found")

    db.delete(measurement)
    db.commit()
