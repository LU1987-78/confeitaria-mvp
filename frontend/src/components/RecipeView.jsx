import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Calculator, 
  ChefHat,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const RecipeView = ({ recipe, onBack, onEdit }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfitColor = (margin) => {
    if (margin < 20) return 'bg-red-100 text-red-800';
    if (margin > 50) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getProfitAlert = () => {
    if (recipe.unit_cost > recipe.suggested_price) {
      return { type: 'error', message: 'Preço de venda menor que o custo!', icon: AlertTriangle };
    }
    if (recipe.profit_margin > 50) {
      return { type: 'success', message: 'Margem de lucro excelente!', icon: CheckCircle };
    }
    if (recipe.profit_margin < 20) {
      return { type: 'warning', message: 'Margem de lucro baixa', icon: AlertTriangle };
    }
    return null;
  };

  const profitAlert = getProfitAlert();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <ChefHat className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900">{recipe.name}</h1>
              </div>
            </div>
            <Button onClick={() => onEdit(recipe)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo da Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Receita</CardTitle>
                <CardDescription>
                  Criada em {formatDate(recipe.created_at)}
                  {recipe.updated_at && recipe.updated_at !== recipe.created_at && 
                    ` • Atualizada em ${formatDate(recipe.updated_at)}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{recipe.yield_quantity}</div>
                    <div className="text-sm text-gray-600">Unidades</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(recipe.unit_cost)}
                    </div>
                    <div className="text-sm text-gray-600">Custo/Unidade</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {recipe.profit_margin.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Margem</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calculator className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(recipe.suggested_price)}
                    </div>
                    <div className="text-sm text-gray-600">Preço Sugerido</div>
                  </div>
                </div>

                {recipe.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                    <p className="text-gray-700">{recipe.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lista de Ingredientes */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes ({recipe.ingredients.length})</CardTitle>
                <CardDescription>
                  Lista completa com custos calculados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                        <Badge variant="outline">
                          {formatCurrency(ingredient.cost)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Quantidade usada:</span>
                          <div className="font-medium">
                            {ingredient.quantity_used} {ingredient.unit}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Preço da embalagem:</span>
                          <div className="font-medium">
                            {formatCurrency(ingredient.package_price)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Tamanho da embalagem:</span>
                          <div className="font-medium">
                            {ingredient.package_quantity} {ingredient.package_unit}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Custo por {ingredient.unit}:</span>
                          <div className="font-medium">
                            {formatCurrency(ingredient.package_price / ingredient.package_quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Análise */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Análise de Lucro */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Análise de Lucro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profitAlert && (
                    <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                      profitAlert.type === 'error' ? 'bg-red-50 text-red-700' :
                      profitAlert.type === 'success' ? 'bg-green-50 text-green-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      <profitAlert.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{profitAlert.message}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Custo Total:</span>
                      <span className="font-medium">{formatCurrency(recipe.total_cost)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Custo por Unidade:</span>
                      <span className="font-medium">{formatCurrency(recipe.unit_cost)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Margem de Lucro:</span>
                      <Badge className={getProfitColor(recipe.profit_margin)}>
                        {recipe.profit_margin.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Preço Sugerido:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(recipe.suggested_price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lucro por Unidade:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(recipe.unit_profit)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lucro Total:</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(recipe.unit_profit * recipe.yield_quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simulador de Preços */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulador Rápido</CardTitle>
                  <CardDescription>
                    Veja o impacto de diferentes margens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[20, 30, 40, 50].map(margin => {
                      const price = recipe.unit_cost * (1 + margin / 100);
                      const profit = price - recipe.unit_cost;
                      return (
                        <div key={margin} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{margin}%:</span>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(price)}</div>
                            <div className="text-xs text-gray-500">
                              +{formatCurrency(profit)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

export default RecipeView;
