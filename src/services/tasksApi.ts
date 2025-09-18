import type { Task, TaskStatus } from '../utils/types';

export interface GetTasksParams {
  page: number;
  limit: number;
  status?: TaskStatus; 
  search?: string;
}

export interface GetTasksResponse {
  data: Task[];
  total: number;
}

let mockTasks: Task[] = [];

// Load mock data
const loadMockData = async (): Promise<Task[]> => {
  if (mockTasks.length === 0) {
    try {
      const response = await fetch('/mock-tasks.json');
      mockTasks = await response.json();
    } catch (error) {
      console.error('Failed to load mock data:', error);
      mockTasks = [];
    }
  }
  return mockTasks;
};

export const getTasks = async (params: GetTasksParams): Promise<GetTasksResponse> => {
  const { page, limit, status, search } = params;
  
  // Load mock data
  const allTasks = await loadMockData();
  
  // Apply filters
  let filteredTasks = allTasks;
  
  // Filter by status
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  // Filter by search (title includes search term, case insensitive)
  if (search && search.trim()) {
    const searchTerm = search.trim().toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm)
    );
  }
  
  // Calculate pagination
  const total = filteredTasks.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  
  return {
    data: paginatedTasks,
    total
  };
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  const allTasks = await loadMockData();
  return allTasks.find(task => task.id === id) || null;
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const allTasks = await loadMockData();
  
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  allTasks.unshift(newTask); 
  mockTasks = allTasks;
  
  return newTask;
};

export const updateTask = async (
  id: string,
  updates: Partial<Pick<Task, 'title' | 'status' | 'description'>>
  ): Promise<Task | null> => {
  const allTasks = await loadMockData();
  const taskIndex = allTasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const updatedTask: Task = {
    ...allTasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  allTasks[taskIndex] = updatedTask;
  mockTasks = allTasks;
  
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const allTasks = await loadMockData();
  const taskIndex = allTasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return false;
  }
  
  allTasks.splice(taskIndex, 1);
  mockTasks = allTasks;
  
  return true;
};

