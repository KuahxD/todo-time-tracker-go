
const API_BASE_URL = 'http://localhost:5000';

export interface Todo {
  id?: string;
  body: string;
  completed: boolean;
  visible?: boolean;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  username: string;
  password: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async signup(user: User): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async login(user: User): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getTodos(token: string): Promise<Todo[]> {
    return this.request<Todo[]>('/api/todos', {
      headers: {
        Authorization: token,
      },
    });
  }

  async createTodo(token: string, todo: Omit<Todo, 'id'>): Promise<Todo> {
    return this.request<Todo>('/api/todos', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(token: string, id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
      },
    });
  }

  async deleteTodo(token: string, id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
  }
}

export const apiService = new ApiService();
