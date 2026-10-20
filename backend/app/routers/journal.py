from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import JournalEntry, User
from app.schemas import JournalCreate, JournalOut, JournalUpdate

router = APIRouter(prefix="/journal", tags=["journal"])


def get_own_entry(entry_id: int, user: User, db: Session) -> JournalEntry:
    entry = db.get(JournalEntry, entry_id)
    if entry is None or entry.user_id != user.id:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry


@router.get("", response_model=list[JournalOut])
def list_entries(
    entry_type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(JournalEntry).where(JournalEntry.user_id == current_user.id)
    if entry_type:
        stmt = stmt.where(JournalEntry.entry_type == entry_type)
    stmt = stmt.order_by(JournalEntry.entry_date.desc(), JournalEntry.id.desc())
    return db.scalars(stmt).all()


@router.post("", response_model=JournalOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    data: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = JournalEntry(
        user_id=current_user.id,
        entry_date=data.entry_date or date.today(),
        entry_type=data.entry_type,
        title=data.title,
        content=data.content,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=JournalOut)
def update_entry(
    entry_id: int,
    data: JournalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = get_own_entry(entry_id, current_user, db)

    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = get_own_entry(entry_id, current_user, db)
    db.delete(entry)
    db.commit()
