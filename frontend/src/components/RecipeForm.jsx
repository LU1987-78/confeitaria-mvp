import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Calculator, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { apiService } from '../services/api';

const RecipeForm = ({ recipe, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    yield_quantity: 1,
    profit_margin: 30.0,
    notes: '',
    ingredients: [
      {
        name: '',
        quantity_used: 0,
        unit: 'g',
        package_price: 0,
        package_quantity: 0,
        package_unit: 'kg'
      }
    ]
  });

  const [calculations, setCalculations] = useState({
    total_cost: 0,
    unit_cost: 0,
    suggested_price: 0,
    unit_profit: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const units = ['g', 'kg', 'ml', 'l', 'unidade', 'xícara', 'colher'];

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        yield_quantity: recipe.yield_quantity,
        profit_margin: recipe.profit_margin,
        notes: recipe.notes || '',
        ingredients: recipe.ingredients.map(ing => ({
          name: ing.name,
          quantity_used: ing.quantity_used,
          unit: ing.unit,
          package_price: ing.package_price,
          package_quantity: ing.package_quantity,
          package_unit: ing.package_unit
        }))
      });
    }
  }, [recipe]);

  useEffect(() => {
    calculateTotals();
  }, [formData]);

  const calculateIngredientCost = (ingredient) => {
    if (!ingredient.package_price || !ingredient.package_quantity || !ingredient.quantity_used) {
      return 0;
    }
    
    // Converter unidades se necessário (simplificado)
    let conversionFactor = 1;
    if (ingredient.unit === 'g' && ingredient.package_unit === 'kg') {
      conversionFactor = 1000;
    } else if (ingredient.unit === 'ml' && ingredient.package_unit === 'l') {
      conversionFactor = 1000;
    } else if (ingredient.unit === 'kg' && ingredient.package_unit === 'g') {
      conversionFactor = 0.001;
    } else if (ingredient.unit === 'l' && ingredient.package_unit === 'ml') {
      conversionFactor = 0.001;
    }

    const adjustedPackageQuantity = ingredient.package_quantity * conversionFactor;
    const costPerUnit = ingredient.package_price / adjustedPackageQuantity;
    return costPerUnit * ingredient.quantity_used;
  };

  const calculateTotals = () => {
    const totalCost = formData.ingredients.reduce((sum, ingredient) => {
      return sum + calculateIngredientCost(ingredient);
    }, 0);

    const unitCost = formData.yield_quantity > 0 ? totalCost / formData.yield_quantity : 0;
    const suggestedPrice = unitCost * (1 + formData.profit_margin / 100);
    const unitProfit = suggestedPrice - unitCost;

    setCalculations({
      total_cost: totalCost,
      unit_cost: unitCost,
      suggested_price: suggestedPrice,
      unit_profit: unitProfit
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          name: '',
          quantity_used: 0,
          unit: 'g',
          package_price: 0,
          package_quantity: 0,
          package_unit: 'kg'
        }
      ]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const updateIngredient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.map(ing => ({
          ...ing,
          quantity_used: parseFloat(ing.quantity_used) || 0,
          package_price: parseFloat(ing.package_price) || 0,
          package_quantity: parseFloat(ing.package_quantity) || 0
        }))
      };

      let result;
      if (recipe) {
        result = await apiService.updateRecipe(recipe.id, recipeData);
      } else {
        result = await apiService.createRecipe(recipeData);
      }

      onSave(result);
    } catch (error) {
      setError('Erro ao salvar receita: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProfitAlert = () => {
    if (calculations.unit_cost > calculations.suggested_price) {
      return { type: 'error', message: 'Preço de venda menor que o custo!' };
    }
    if (formData.profit_margin > 50) {
      return { type: 'success', message: 'Margem de lucro excelente!' };
    }
    if (formData.profit_margin < 20) {
      return { type: 'warning', message: 'Margem de lucro baixa' };
    }
    return null;
  };

  const profitAlert = getProfitAlert();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              {recipe ? 'Editar Receita' : 'Nova Receita'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Receita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Receita</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Bolo de Chocolate"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yield">Rendimento (unidades)</Label>
                      <Input
                        id="yield"
                        type="number"
                        min="1"
                        value={formData.yield_quantity}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          yield_quantity: parseInt(e.target.value) || 1 
                        }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="margin">Margem de Lucro (%)</Label>
                      <Input
                        id="margin"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.profit_margin}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          profit_margin: parseFloat(e.target.value) || 0 
                        }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Anotações sobre a receita..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ingredientes */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Ingredientes</CardTitle>
                    <Button type="button" onClick={addIngredient} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Ingrediente {index + 1}</h4>
                        {formData.ingredients.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Nome do Ingrediente</Label>
                          <Input
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                            placeholder="Ex: Farinha de trigo"
                            required
                          />
                        </div>

                        <div>
                          <Label>Quantidade Usada</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ingredient.quantity_used}
                              onChange={(e) => updateIngredient(index, 'quantity_used', e.target.value)}
                              placeholder="200"
                              required
                            />
                            <select
                              value={ingredient.unit}
                              onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                              className="px-3 py-2 border rounded-md"
                            >
                              {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label>Preço da Embalagem</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ingredient.package_price}
                            onChange={(e) => updateIngredient(index, 'package_price', e.target.value)}
                            placeholder="10.50"
                            required
                          />
                        </div>

                        <div>
                          <Label>Quantidade da Embalagem</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ingredient.package_quantity}
                              onChange={(e) => updateIngredient(index, 'package_quantity', e.target.value)}
                              placeholder="1"
                              required
                            />
                            <select
                              value={ingredient.package_unit}
                              onChange={(e) => updateIngredient(index, 'package_unit', e.target.value)}
                              className="px-3 py-2 border rounded-md"
                            >
                              {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="bg-gray-50 p-3 rounded-md">
                            <span className="text-sm text-gray-600">Custo deste ingrediente: </span>
                            <span className="font-medium">
                              {formatCurrency(calculateIngredientCost(ingredient))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Botões */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      {recipe ? 'Atualizar' : 'Criar'} Receita
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Painel de Cálculos */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Cálculos Automáticos
                  </CardTitle>
                  <CardDescription>
                    Valores calculados em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profitAlert && (
                    <Alert variant={profitAlert.type === 'error' ? 'destructive' : 'default'}>
                      {profitAlert.type === 'error' && <AlertTriangle className="h-4 w-4" />}
                      {profitAlert.type === 'success' && <CheckCircle className="h-4 w-4" />}
                      <AlertDescription>{profitAlert.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Custo Total:</span>
                      <span className="font-medium">{formatCurrency(calculations.total_cost)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Custo por Unidade:</span>
                      <span className="font-medium">{formatCurrency(calculations.unit_cost)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Margem de Lucro:</span>
                      <Badge variant="outline">{formData.profit_margin.toFixed(1)}%</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Preço Sugerido:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(calculations.suggested_price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lucro por Unidade:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(calculations.unit_profit)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rendimento:</span>
                        <span className="font-medium">{formData.yield_quantity} unidades</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeForm;
