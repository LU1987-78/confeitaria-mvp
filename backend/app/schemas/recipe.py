from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class IngredientBase(BaseModel):
    name: str
    quantity_used: float
    unit: str
    package_price: float
    package_quantity: float
    package_unit: str

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    cost: float
    recipe_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    name: str
    yield_quantity: int
    profit_margin: float = 30.0
    notes: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate]

class RecipeUpdate(RecipeBase):
    ingredients: List[IngredientUpdate]

class Recipe(RecipeBase):
    id: int
    total_cost: float
    unit_cost: float
    suggested_price: float
    unit_profit: float
    owner_id: int
    ingredients: List[Ingredient]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RecipeList(BaseModel):
    id: int
    name: str
    total_cost: float
    unit_cost: float
    suggested_price: float
    unit_profit: float
    yield_quantity: int
    profit_margin: float
    created_at: datetime

    class Config:
        from_attributes = True
