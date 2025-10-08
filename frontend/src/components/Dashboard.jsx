import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  ChefHat, 
  DollarSign, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Dashboard = ({ onCreateRecipe, onEditRecipe, onViewRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRecipes();
      setRecipes(data);
    } catch (error) {
      setError('Erro ao carregar receitas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) {
      return;
    }

    try {
      await apiService.deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      setError('Erro ao excluir receita: ' + error.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProfitColor = (margin) => {
    if (margin < 20) return 'bg-red-100 text-red-800';
    if (margin > 50) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">Confeitaria MVP</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recipes.length > 0 
                  ? formatCurrency(recipes.reduce((acc, recipe) => acc + recipe.unit_cost, 0) / recipes.length)
                  : formatCurrency(0)
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recipes.length > 0 
                  ? `${(recipes.reduce((acc, recipe) => acc + recipe.profit_margin, 0) / recipes.length).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Suas Receitas</h2>
          <Button onClick={onCreateRecipe} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Receita</span>
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando receitas...</p>
          </div>
        ) : recipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma receita encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando sua primeira receita para calcular custos e preços.
              </p>
              <Button onClick={onCreateRecipe}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Receita
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <CardDescription>
                        Rende {recipe.yield_quantity} unidades
                      </CardDescription>
                    </div>
                    <Badge className={getProfitColor(recipe.profit_margin)}>
                      {recipe.profit_margin.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Custo por unidade:</span>
                      <span className="font-medium">{formatCurrency(recipe.unit_cost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço sugerido:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(recipe.suggested_price)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lucro por unidade:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(recipe.unit_profit)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewRecipe(recipe)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditRecipe(recipe)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
