const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Métodos para receitas
  async getRecipes() {
    return this.request('/api/recipes/');
  }

  async getRecipe(id) {
    return this.request(`/api/recipes/${id}`);
  }

  async createRecipe(recipeData) {
    return this.request('/api/recipes/', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(id, recipeData) {
    return this.request(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
  }

  async deleteRecipe(id) {
    return this.request(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
