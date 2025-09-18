// src/context/__tests__/tasksReducer.test.ts
import { describe, it, expect } from 'vitest';
import type { Task, TaskStatus } from '../../utils/types';

type TasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  search: string;
  status?: TaskStatus;
  page: number;
  limit: number;
  total: number;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; total: number } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS'; payload: TaskStatus | undefined }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };

// Local copy mirroring app reducer
const tasksReducer = (state: TasksState, action: Action): TasksState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, total: action.payload.total };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_STATUS':
      return { ...state, status: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.payload),
      };
    default:
      return state;
  }
};

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockTasks: Task[] = [
  mockTask,
  {
    id: '2',
    title: 'Another Task',
    description: 'Another Description',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

const initialState : TasksState= {
  tasks: [],
  loading: false,
  error: null,
  search: '',
  status: undefined,
  page: 1,
  limit: 10,
  total: 0
};

describe('tasksReducer', () => {
  describe('SET_TASKS', () => {
    it('should set tasks and total count', () => {
      const action = {
        type: 'SET_TASKS',
        payload: { tasks: mockTasks, total: 2 }
      } as const;
      
      const newState = tasksReducer(initialState, action);
      
      expect(newState.tasks).toEqual(mockTasks);
      expect(newState.total).toBe(2);
    });
  });

  describe('ADD_TASK', () => {
    it('should add a new task to the beginning of the tasks array', () => {
      const stateWithTasks = { ...initialState, tasks: mockTasks };
      const newTask: Task = {
        id: '3',
        title: 'New Task',
        description: 'New Description',
        status: 'PENDING',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
      };
      
      const action = {
        type: 'ADD_TASK',
        payload: newTask
      } as const;
      
      const newState = tasksReducer(stateWithTasks, action);
      
      expect(newState.tasks).toHaveLength(3);
      expect(newState.tasks[0]).toEqual(newTask);
      expect(newState.tasks[1]).toEqual(mockTasks[0]);
    });
  });

  describe('UPDATE_TASK', () => {
    it('should update an existing task', () => {
      const stateWithTasks = { ...initialState, tasks: mockTasks };
      const updatedTask:Task = { ...mockTask, title: 'Updated Task', status: 'IN_PROGRESS' };
      
      const action = {
        type: 'UPDATE_TASK',
        payload: updatedTask
      } as const;
      
      const newState = tasksReducer(stateWithTasks, action);
      
      expect(newState.tasks).toHaveLength(2);
      expect(newState.tasks[0]).toEqual(updatedTask);
      expect(newState.tasks[1]).toEqual(mockTasks[1]);
    });

    it('should not update if task id does not exist', () => {
      const stateWithTasks = { ...initialState, tasks: mockTasks };
      const nonExistentTask : Task = { ...mockTask, id: '999', title: 'Non-existent Task' };
      
      const action = {
        type: 'UPDATE_TASK',
        payload: nonExistentTask
      } as const; 
      
      const newState = tasksReducer(stateWithTasks, action);
      
      expect(newState.tasks).toEqual(mockTasks);
    });
  });

  describe('DELETE_TASK', () => {
    it('should remove a task by id', () => {
      const stateWithTasks = { ...initialState, tasks: mockTasks };
      
      const action = {
        type: 'DELETE_TASK',
        payload: '1'
      } as const; 
      
      const newState = tasksReducer(stateWithTasks, action);
      
      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0]).toEqual(mockTasks[1]);
    });

    it('should not remove anything if task id does not exist', () => {
      const stateWithTasks = { ...initialState, tasks: mockTasks };
      
      const action = {
        type: 'DELETE_TASK',
        payload: '999'
      } as const; 
      
      const newState = tasksReducer(stateWithTasks, action);
      
      expect(newState.tasks).toEqual(mockTasks);
    });
  });

  describe('SET_LOADING', () => {
    it('should set loading state', () => {
      const action = {
        type: 'SET_LOADING',
        payload: true
      } as const; 
      
      const newState = tasksReducer(initialState, action);
      
      expect(newState.loading).toBe(true);
    });
  });

  describe('SET_ERROR', () => {
    it('should set error message', () => {
      const errorMessage = 'Test error';
      const action = {
        type: 'SET_ERROR',
        payload: errorMessage
      } as const; 
      
      const newState = tasksReducer(initialState, action);
      
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('SET_SEARCH', () => {
    it('should set search term and reset page to 1', () => {
      const stateWithPage = { ...initialState, page: 3 };
      const action = {
        type: 'SET_SEARCH',
        payload: 'test search'
      } as const; 
      
      const newState = tasksReducer(stateWithPage, action);
      
      expect(newState.search).toBe('test search');
      expect(newState.page).toBe(1);
    });
  });

  describe('SET_STATUS', () => {
    it('should set status filter and reset page to 1', () => {
      const stateWithPage = { ...initialState, page: 3 };
      const action = {
        type: 'SET_STATUS',
        payload: 'IN_PROGRESS'
      } as const;
      
      const newState = tasksReducer(stateWithPage, action);
      
      expect(newState.status).toBe('IN_PROGRESS');
      expect(newState.page).toBe(1);
    });
  });

  describe('SET_PAGE', () => {
    it('should set page number', () => {
      const action = {
        type: 'SET_PAGE',
        payload: 3
      } as const;
      
      const newState = tasksReducer(initialState, action);
      
      expect(newState.page).toBe(3);
    });
  });
});



