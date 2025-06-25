
const API_BASE_URL = 'https://go-practice-projects-1.onrender.com';

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
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async createTodo(token,body1) {
  const res = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ body: body1.body })
  });
  return await res.json();
}

  async updateTodo(token: string, id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteTodo(token: string, id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
