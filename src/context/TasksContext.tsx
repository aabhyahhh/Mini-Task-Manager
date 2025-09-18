import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasksApi';
import type { GetTasksParams } from "../services/tasksApi";           
import type { Task, TaskStatus } from "../utils/types";             

// State interface
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  search: string;
  status?: TaskStatus; 
  page: number;
  limit: number;
  total: number;
}

// Action types
type TasksAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; total: number } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS'; payload: TaskStatus| undefined  }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };


// Initial state
const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  search: '',
  status: undefined,
  page: 1,
  limit: 10,
  total: 0,
};

// Reducer
const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      case "SET_TASKS":
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
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    default:
      return state;
  }
};

// Context
interface TasksContextType {
  state: TasksState;
  dispatch: React.Dispatch<TasksAction>;
  fetchTasks: () => Promise<void>;
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTaskById: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'status' | 'description'>>
  ) => Promise<Task>;
  deleteTaskById: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Provider component
interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Fetch tasks function
  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const params: GetTasksParams = {
        page: state.page,
        limit: state.limit,
        status: state.status ?? undefined,
        search: state.search || undefined,
      };

      const response = await getTasks(params);
      dispatch({ type: 'SET_TASKS', payload: { tasks: response.data, total: response.total },  });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.page, state.limit, state.status, state.search]);

  // Add task function
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    try {
      const newTask = await createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask; 
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
      throw new Error('create failed'); 
    }
  };

  // Update task function
  const updateTaskById = async (
      id: string,
      updates: Partial<Pick<Task, 'title' | 'status' | 'description'>>
    ): Promise<Task> => {
    try {
      const updatedTask = await updateTask(id, updates);
        if (!updatedTask) {
                const err = new Error('Task not found');
                dispatch({ type: 'SET_ERROR', payload: err.message });
                throw err;
              }
              dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
              return updatedTask; 
      } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
      throw new Error('update failed'); 
    }
  };

  // Delete task function
  const deleteTaskById = async (id: string) => {
    try {
      const success = await deleteTask(id);
      if (success) {
        dispatch({ type: 'DELETE_TASK', payload: id });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  // Auto-fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const contextValue: TasksContextType = {
    state,
    dispatch,
    fetchTasks,
    addTask,
    updateTaskById,
    deleteTaskById,
  };

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
};

// Hook to use the context
export const useTasks = (): TasksContextType => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
};

