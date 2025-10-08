from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    yield_quantity = Column(Integer, nullable=False)  # Quantas unidades a receita rende
    profit_margin = Column(Float, default=30.0)  # Margem de lucro em porcentagem
    total_cost = Column(Float, default=0.0)  # Custo total calculado
    unit_cost = Column(Float, default=0.0)  # Custo por unidade
    suggested_price = Column(Float, default=0.0)  # Preço sugerido
    unit_profit = Column(Float, default=0.0)  # Lucro por unidade
    notes = Column(Text, nullable=True)  # Observações opcionais
    
    # Relacionamento com usuário
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")
    
    # Relacionamento com ingredientes
    ingredients = relationship("Ingredient", back_populates="recipe", cascade="all, delete-orphan")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity_used = Column(Float, nullable=False)  # Quantidade usada na receita
    unit = Column(String, nullable=False)  # Unidade (g, kg, ml, l, etc.)
    package_price = Column(Float, nullable=False)  # Preço pago na embalagem
    package_quantity = Column(Float, nullable=False)  # Quantidade total da embalagem
    package_unit = Column(String, nullable=False)  # Unidade da embalagem
    cost = Column(Float, default=0.0)  # Custo calculado do ingrediente
    
    # Relacionamento com receita
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    recipe = relationship("Recipe", back_populates="ingredients")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
