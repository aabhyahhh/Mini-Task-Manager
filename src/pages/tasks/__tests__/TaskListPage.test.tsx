// src/pages/tasks/__tests__/TaskListPage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TaskListPage from '../TaskListPage';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the TasksContext
const mockTasksContext = {
  state: {
    tasks: [],
    loading: false,
    error: null,
    search: '',
    status: 'ALL',
    page: 1,
    limit: 10,
    total: 0
  },
  dispatch: vi.fn(),
  fetchTasks: vi.fn(),
  addTask: vi.fn(),
  updateTaskById: vi.fn(),
  deleteTaskById: vi.fn()
};

vi.mock('../../../context/TasksContext', () => ({
  useTasks: () => mockTasksContext
}));

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('TaskListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Project UI/UX')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('renders Kanban columns', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Board')).toBeInTheDocument();
  });

  it('renders page header and search', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Project UI/UX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    render(
      <TestWrapper>
        <TaskListPage />
      </TestWrapper>
    );

    // Should show empty state messages in columns (3 columns)
    expect(screen.getAllByText('No tasks in this column')).toHaveLength(3);
  });
});