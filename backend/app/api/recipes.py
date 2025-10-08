from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.recipe import Recipe, RecipeCreate, RecipeUpdate, RecipeList
from app.schemas.user import User
from app.crud import recipe as crud_recipe
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[RecipeList])
async def read_recipes(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar receitas do usuário"""
    recipes = crud_recipe.get_recipes(db, user_id=current_user.id, skip=skip, limit=limit)
    return recipes

@router.post("/", response_model=Recipe)
async def create_recipe(
    recipe: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar nova receita"""
    return crud_recipe.create_recipe(db=db, recipe=recipe, user_id=current_user.id)

@router.get("/{recipe_id}", response_model=Recipe)
async def read_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter receita específica"""
    db_recipe = crud_recipe.get_recipe(db, recipe_id=recipe_id, user_id=current_user.id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.put("/{recipe_id}", response_model=Recipe)
async def update_recipe(
    recipe_id: int,
    recipe: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar receita"""
    db_recipe = crud_recipe.update_recipe(db, recipe_id=recipe_id, recipe=recipe, user_id=current_user.id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar receita"""
    success = crud_recipe.delete_recipe(db, recipe_id=recipe_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "Recipe deleted successfully"}
