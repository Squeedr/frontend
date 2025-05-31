import apiClient from './client';

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  selectedRole?: string; // app_role name (client/expert/owner)
}

export const authApi = {
  // Login with email/username and password
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('auth/local', credentials);
    
    // Store the JWT token in localStorage
    if (response.data.jwt) {
      localStorage.setItem('jwt', response.data.jwt);
    }
    
    return response.data;
  },
  
  // Register a new user with proper app_roles population
  register: async (userData: RegisterData) => {
    // Send registration request to backend
    const response = await apiClient.post('auth/local/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      selectedRole: userData.selectedRole || 'client' // Default to client if not specified
    });
    
    // Store the JWT token in localStorage if registration includes auto-login
    if (response.data.jwt) {
      localStorage.setItem('jwt', response.data.jwt);
    }
    
    return response.data;
  },
  
  // Get the current authenticated user with populated app_roles
  getCurrentUser: async () => {
    const response = await apiClient.get('users/me?populate=app_roles');
    return response.data;
  },
  
  // Logout (just removes the token from localStorage)
  logout: () => {
    localStorage.removeItem('jwt');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('jwt');
  }
};
