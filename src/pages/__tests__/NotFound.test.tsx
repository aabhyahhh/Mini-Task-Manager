// src/pages/__tests__/NotFound.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NotFoundPage from '../NotFoundPage';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 404 error message', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getAllByText('Page Not Found')).toHaveLength(2);
  });

  it('renders helpful description', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved/)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Go to Tasks')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('navigates to tasks when "Go to Tasks" button is clicked', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    const goToTasksButton = screen.getByText('Go to Tasks');
    goToTasksButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('navigates back when "Go Back" button is clicked', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    const goBackButton = screen.getByText('Go Back');
    goBackButton.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders with router for unmatched routes', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getAllByText('Page Not Found')).toHaveLength(2);
  });

  it('renders footer with help text', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText(/Need help\? Contact support or check our documentation/)).toBeInTheDocument();
  });

  it('renders search icon in the illustration', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    // The search icon should be present in the illustration
    const searchIcon = screen.getByTestId('SearchIcon') || screen.getByRole('img', { hidden: true });
    expect(searchIcon).toBeInTheDocument();
  });

  it('has proper styling and layout', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    // Check that the main elements are present and properly structured
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getAllByText('Page Not Found')).toHaveLength(2);
    
    // Check that buttons are properly rendered
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
