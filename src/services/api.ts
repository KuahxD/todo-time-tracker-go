
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

    console.log('Making request to:', url, 'with config:', config);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      let error;
      try {
        const errorJson = JSON.parse(errorText);
        error = errorJson.error || errorText;
      } catch {
        error = errorText || `HTTP error! status: ${response.status}`;
      }
      
      throw new Error(error);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
    return responseData;
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
    // Ensure the request body matches exactly what the Go backend expects
    const requestBody = {
      body: todo.body.trim(), // Ensure body is trimmed
      completed: todo.completed,
    };
    
    console.log('Creating todo with body:', requestBody);
    
    return this.request<Todo>('/api/todos', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(requestBody),
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
