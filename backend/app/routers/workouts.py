from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models import (
    Exercise,
    PlanExercise,
    User,
    WorkoutLog,
    WorkoutLogSet,
    WorkoutPlan,
)
from app.schemas import (
    ExerciseOut,
    WorkoutLogCreate,
    WorkoutLogOut,
    WorkoutPlanCreate,
    WorkoutPlanOut,
    WorkoutPlanUpdate,
)

router = APIRouter(prefix="/workouts", tags=["workouts"])


# ─── Exercises (read-only library) ────────────────────────────────

@router.get("/exercises", response_model=list[ExerciseOut])
def list_exercises(
    muscle_group: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(Exercise).order_by(Exercise.muscle_group, Exercise.name)
    if muscle_group:
        stmt = stmt.where(Exercise.muscle_group.ilike(muscle_group))
    return db.scalars(stmt).all()


# ─── Workout Plans ────────────────────────────────────────────────

def _load_plan(plan_id: int, user: User, db: Session) -> WorkoutPlan:
    """Fetch a plan with its exercises. The plan must be owned by the user or be a default plan."""
    stmt = (
        select(WorkoutPlan)
        .options(joinedload(WorkoutPlan.plan_exercises).joinedload(PlanExercise.exercise))
        .where(WorkoutPlan.id == plan_id)
    )
    plan = db.scalars(stmt).unique().first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    if plan.user_id is not None and plan.user_id != user.id:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    return plan


@router.get("/plans", response_model=list[WorkoutPlanOut])
def list_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all default plans + user's custom plans."""
    stmt = (
        select(WorkoutPlan)
        .options(joinedload(WorkoutPlan.plan_exercises).joinedload(PlanExercise.exercise))
        .where(
            (WorkoutPlan.user_id == current_user.id) | (WorkoutPlan.is_default == True)  # noqa: E712
        )
        .order_by(WorkoutPlan.is_default.desc(), WorkoutPlan.created_at.desc())
    )
    return db.scalars(stmt).unique().all()


@router.get("/plans/{plan_id}", response_model=WorkoutPlanOut)
def get_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _load_plan(plan_id, current_user, db)


@router.post("/plans", response_model=WorkoutPlanOut, status_code=status.HTTP_201_CREATED)
def create_plan(
    data: WorkoutPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = WorkoutPlan(
        user_id=current_user.id,
        name=data.name,
        focus=data.focus,
        duration_min=data.duration_min,
    )

    for ex_in in data.exercises:
        exercise = db.get(Exercise, ex_in.exercise_id)
        if exercise is None:
            raise HTTPException(
                status_code=422,
                detail=f"Exercise {ex_in.exercise_id} not found",
            )
        plan.plan_exercises.append(
            PlanExercise(
                exercise_id=ex_in.exercise_id,
                order=ex_in.order,
                target_sets=ex_in.target_sets,
                target_reps=ex_in.target_reps,
            )
        )

    db.add(plan)
    db.commit()
    return _load_plan(plan.id, current_user, db)


@router.put("/plans/{plan_id}", response_model=WorkoutPlanOut)
def update_plan(
    plan_id: int,
    data: WorkoutPlanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = _load_plan(plan_id, current_user, db)

    if plan.is_default:
        raise HTTPException(status_code=403, detail="Cannot edit a default plan")
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your plan")

    if data.name is not None:
        plan.name = data.name
    if data.focus is not None:
        plan.focus = data.focus
    if data.duration_min is not None:
        plan.duration_min = data.duration_min

    if data.exercises is not None:
        plan.plan_exercises.clear()
        for ex_in in data.exercises:
            exercise = db.get(Exercise, ex_in.exercise_id)
            if exercise is None:
                raise HTTPException(
                    status_code=422,
                    detail=f"Exercise {ex_in.exercise_id} not found",
                )
            plan.plan_exercises.append(
                PlanExercise(
                    exercise_id=ex_in.exercise_id,
                    order=ex_in.order,
                    target_sets=ex_in.target_sets,
                    target_reps=ex_in.target_reps,
                )
            )

    db.commit()
    return _load_plan(plan.id, current_user, db)


@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = _load_plan(plan_id, current_user, db)
    if plan.is_default:
        raise HTTPException(status_code=403, detail="Cannot delete a default plan")
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your plan")

    db.delete(plan)
    db.commit()


# ─── Workout Logs (completed sessions) ────────────────────────────

@router.post("/logs", response_model=WorkoutLogOut, status_code=status.HTTP_201_CREATED)
def create_log(
    data: WorkoutLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = WorkoutLog(
        user_id=current_user.id,
        plan_id=data.plan_id,
        completed_at=datetime.now(timezone.utc),
        notes=data.notes,
    )

    for s in data.sets:
        exercise = db.get(Exercise, s.exercise_id)
        if exercise is None:
            raise HTTPException(
                status_code=422,
                detail=f"Exercise {s.exercise_id} not found",
            )
        log.sets.append(
            WorkoutLogSet(
                exercise_id=s.exercise_id,
                set_number=s.set_number,
                weight_kg=s.weight_kg,
                reps=s.reps,
            )
        )

    db.add(log)
    db.commit()
    db.refresh(log)

    # Re-load with joined exercise data
    stmt = (
        select(WorkoutLog)
        .options(joinedload(WorkoutLog.sets).joinedload(WorkoutLogSet.exercise))
        .where(WorkoutLog.id == log.id)
    )
    return db.scalars(stmt).unique().first()


@router.get("/logs", response_model=list[WorkoutLogOut])
def list_logs(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = (
        select(WorkoutLog)
        .options(joinedload(WorkoutLog.sets).joinedload(WorkoutLogSet.exercise))
        .where(WorkoutLog.user_id == current_user.id)
        .order_by(WorkoutLog.completed_at.desc())
        .limit(limit)
    )
    return db.scalars(stmt).unique().all()


@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = db.get(WorkoutLog, log_id)
    if log is None or log.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Workout log not found")
    db.delete(log)
    db.commit()
