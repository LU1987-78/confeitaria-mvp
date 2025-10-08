from sqlalchemy.orm import Session
from typing import List
from app.models.recipe import Recipe, Ingredient
from app.schemas.recipe import RecipeCreate, RecipeUpdate

def calculate_ingredient_cost(ingredient_data) -> float:
    """Calcular o custo de um ingrediente"""
    # Custo = (quantidade usada ÷ quantidade total) × preço pago
    cost_per_unit = ingredient_data.package_price / ingredient_data.package_quantity
    total_cost = cost_per_unit * ingredient_data.quantity_used
    return round(total_cost, 2)

def calculate_recipe_totals(recipe: Recipe) -> Recipe:
    """Calcular totais da receita"""
    # Calcular custo total
    total_cost = sum(ingredient.cost for ingredient in recipe.ingredients)
    recipe.total_cost = round(total_cost, 2)
    
    # Calcular custo por unidade
    recipe.unit_cost = round(total_cost / recipe.yield_quantity, 2) if recipe.yield_quantity > 0 else 0
    
    # Calcular preço sugerido com margem de lucro
    recipe.suggested_price = round(recipe.unit_cost * (1 + recipe.profit_margin / 100), 2)
    
    # Calcular lucro por unidade
    recipe.unit_profit = round(recipe.suggested_price - recipe.unit_cost, 2)
    
    return recipe

def get_recipes(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Buscar receitas do usuário"""
    return db.query(Recipe).filter(Recipe.owner_id == user_id).offset(skip).limit(limit).all()

def get_recipe(db: Session, recipe_id: int, user_id: int):
    """Buscar receita específica do usuário"""
    return db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.owner_id == user_id).first()

def create_recipe(db: Session, recipe: RecipeCreate, user_id: int):
    """Criar nova receita"""
    # Criar receita
    db_recipe = Recipe(
        name=recipe.name,
        yield_quantity=recipe.yield_quantity,
        profit_margin=recipe.profit_margin,
        notes=recipe.notes,
        owner_id=user_id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    # Adicionar ingredientes
    for ingredient_data in recipe.ingredients:
        cost = calculate_ingredient_cost(ingredient_data)
        db_ingredient = Ingredient(
            name=ingredient_data.name,
            quantity_used=ingredient_data.quantity_used,
            unit=ingredient_data.unit,
            package_price=ingredient_data.package_price,
            package_quantity=ingredient_data.package_quantity,
            package_unit=ingredient_data.package_unit,
            cost=cost,
            recipe_id=db_recipe.id
        )
        db.add(db_ingredient)
    
    db.commit()
    db.refresh(db_recipe)
    
    # Calcular totais
    db_recipe = calculate_recipe_totals(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    return db_recipe

def update_recipe(db: Session, recipe_id: int, recipe: RecipeUpdate, user_id: int):
    """Atualizar receita"""
    db_recipe = get_recipe(db, recipe_id, user_id)
    if not db_recipe:
        return None
    
    # Atualizar dados da receita
    db_recipe.name = recipe.name
    db_recipe.yield_quantity = recipe.yield_quantity
    db_recipe.profit_margin = recipe.profit_margin
    db_recipe.notes = recipe.notes
    
    # Remover ingredientes antigos
    db.query(Ingredient).filter(Ingredient.recipe_id == recipe_id).delete()
    
    # Adicionar novos ingredientes
    for ingredient_data in recipe.ingredients:
        cost = calculate_ingredient_cost(ingredient_data)
        db_ingredient = Ingredient(
            name=ingredient_data.name,
            quantity_used=ingredient_data.quantity_used,
            unit=ingredient_data.unit,
            package_price=ingredient_data.package_price,
            package_quantity=ingredient_data.package_quantity,
            package_unit=ingredient_data.package_unit,
            cost=cost,
            recipe_id=recipe_id
        )
        db.add(db_ingredient)
    
    db.commit()
    db.refresh(db_recipe)
    
    # Calcular totais
    db_recipe = calculate_recipe_totals(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    return db_recipe

def delete_recipe(db: Session, recipe_id: int, user_id: int):
    """Deletar receita"""
    db_recipe = get_recipe(db, recipe_id, user_id)
    if not db_recipe:
        return False
    
    db.delete(db_recipe)
    db.commit()
    return True
