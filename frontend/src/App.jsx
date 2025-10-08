import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import RecipeForm from './components/RecipeForm';
import RecipeView from './components/RecipeView';
import { ChefHat } from 'lucide-react';
import './App.css';

const AuthWrapper = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const { user, loading } = useAuth();

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleCreateRecipe = () => {
    setSelectedRecipe(null);
    setCurrentView('form');
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('form');
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('view');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedRecipe(null);
  };

  const handleSaveRecipe = (savedRecipe) => {
    // Após salvar, voltar para o dashboard
    setCurrentView('dashboard');
    setSelectedRecipe(null);
    // Aqui poderia atualizar a lista de receitas se necessário
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ChefHat className="h-12 w-12 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Confeitaria MVP</h1>
            </div>
            <p className="text-gray-600">
              Sistema de precificação automática para confeitaria
            </p>
          </div>

          {/* Auth Forms */}
          {isLoginMode ? (
            <Login onToggleMode={toggleAuthMode} />
          ) : (
            <Register onToggleMode={toggleAuthMode} />
          )}
        </div>
      </div>
    );
  }

  // Renderizar diferentes views baseado no estado atual
  switch (currentView) {
    case 'dashboard':
      return (
        <Dashboard
          onCreateRecipe={handleCreateRecipe}
          onEditRecipe={handleEditRecipe}
          onViewRecipe={handleViewRecipe}
        />
      );
    case 'form':
      return (
        <RecipeForm
          recipe={selectedRecipe}
          onBack={handleBackToDashboard}
          onSave={handleSaveRecipe}
        />
      );
    case 'view':
      return (
        <RecipeView
          recipe={selectedRecipe}
          onBack={handleBackToDashboard}
          onEdit={handleEditRecipe}
        />
      );
    default:
      return <Dashboard onCreateRecipe={handleCreateRecipe} onEditRecipe={handleEditRecipe} onViewRecipe={handleViewRecipe} />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;
