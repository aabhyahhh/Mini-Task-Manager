import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import NotFoundPage from './pages/NotFoundPage';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskDetailsPage from './pages/tasks/TaskDetailsPage';
import AddTaskPage from './pages/tasks/AddTaskPage';
import EditTaskPage from './pages/tasks/EditTaskPage';
import { TasksProvider } from './context/TasksContext';

function App() {
  return (
    <TasksProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<TaskListPage />} />
            <Route path="tasks/new" element={<AddTaskPage />} />
            <Route path="tasks/:id" element={<TaskDetailsPage />} />
            <Route path="tasks/:id/edit" element={<EditTaskPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TasksProvider>
  );
}

export default App;
