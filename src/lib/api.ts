const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* =======================
   Types
======================= */

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

/* =======================
   Error class
======================= */

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/* =======================
   Helpers
======================= */

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* =======================
   AUTH API
======================= */

export const authApi = {
  async login(credentials: LoginCredentials): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError(401, 'Invalid email or password');
      }
      throw new ApiError(response.status, 'Login failed');
    }

    // Backend returns RAW JWT string (not JSON)
    const token = await response.text();

    if (!token) {
      throw new ApiError(500, 'Empty token received from server');
    }

    return token;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new ApiError(409, 'Email already registered');
      }
      throw new ApiError(response.status, 'Registration failed');
    }

    return response.json();
  },

  async testAuth(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/testing`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      // token expired / invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      throw new ApiError(response.status, 'Authentication test failed');
    }

    return response.text();
  },
};

/* =======================
   USER / PUBLIC API
======================= */

export const userApi = {
  async getHello(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Request failed');
    }

    return response.text();
  },
};

/* =======================
   Exports
======================= */

export { ApiError };
export type { LoginCredentials, RegisterData, User };
