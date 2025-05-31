import apiClient from './client';
import type { Workspace } from '@/lib/types';

// Strapi v5 expects data to be wrapped in a "data" object
const wrapData = (data: any) => ({ data });

export interface WorkspaceFilters {
  name?: string;
  location?: string;
  type?: string;
  availability?: string;
  capacity?: number;
  page?: number;
  pageSize?: number;
}

export const workspacesApi = {
  // Get all workspaces with optional filtering
  getAll: async (filters?: WorkspaceFilters) => {
    const params = new URLSearchParams();
    
    // Add filters to params if they exist
    if (filters) {
      if (filters.name) params.append('filters[name][$contains]', filters.name);
      if (filters.location) params.append('filters[location][$contains]', filters.location);
      if (filters.type) params.append('filters[type][$eq]', filters.type);
      if (filters.availability) params.append('filters[availability][$eq]', filters.availability);
      if (filters.capacity) params.append('filters[capacity][$gte]', filters.capacity.toString());
      
      // Pagination
      if (filters.page) params.append('pagination[page]', filters.page.toString());
      if (filters.pageSize) params.append('pagination[pageSize]', filters.pageSize.toString());
    }
    
    const response = await apiClient.get(`workspaces?${params.toString()}`);
    return response.data;
  },
  
  // Get a specific workspace by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`workspaces/${id}`);
    return response.data;
  },
  
  // Create a new workspace
  create: async (workspace: Partial<Workspace>) => {
    const response = await apiClient.post('workspaces', wrapData(workspace));
    return response.data;
  },
  
  // Update an existing workspace
  update: async (id: string, workspace: Partial<Workspace>) => {
    const response = await apiClient.put(`workspaces/${id}`, wrapData(workspace));
    return response.data;
  },
  
  // Delete a workspace
  delete: async (id: string) => {
    const response = await apiClient.delete(`workspaces/${id}`);
    return response.data;
  }
}; 