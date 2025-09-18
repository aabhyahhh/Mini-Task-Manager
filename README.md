# What this is
A mini task manager (frontend only) that lets you:

- View tasks on a Kanban board (To Do, In Progress, Completed) with search
- Add a task (title, description, status)
- Edit a task (title + status + description)
- Delete a task (with confirmation)
- Open a Task Details page
- See proper loading/error states and a 404 route

**It's a React + Vite app (MUI UI). State is Context + useReducer. Data comes from a local mock file.**

# Quick Navigation (Routes)
Entry: src/App.tsx<br/>
Screens: src/pages/tasks/*<br/>
TaskListPage.tsx – Kanban board + search, empty/error/loading states<br/>
TaskDetailsPage.tsx – details, delete (confirm), edit link<br/>
EditTaskPage.tsx – edit title + status<br/>
AddTaskPage.tsx – create new task<br/>
Global state: src/context/TasksContext.tsx<br/>
Mock API: src/services/tasksApi.ts (reads public/mock-tasks.json)

# Tech Stack
- React 19 + Vite (TypeScript)
- React Router 7
- Context API + useReducer
- Material UI (MUI)
- React Hook Form + Zod (validation)
- Vitest + React Testing Library (sample unit tests)

# Where things live
src/
├─ pages/               // List (board), Details, Add, Edit, 404
├─ components/          // Layout
├─ context/             // TasksContext
├─ services/            // tasksApi (mock)
├─ utils/               // types
└─ tests/               // Vitest setup + samples

# State & Data
State (tasks, loading, error, search) lives in Context + useReducer.
Data is loaded from public/mock-tasks.json and filtered client-side.

# Getting Started (Mock Mode)
Prereqs: Node 18+
- npm install   (or npm install / yarn)
- npm dev       # http://localhost:5173

# Notes
public/mock-tasks.json is the data source.
Create/edit/delete update in-memory state (persist until refresh).

# Features (what exists)
- Kanban board with 3 columns: Pending, In Progress, Completed
- Search by title (case-insensitive)
- Task details page with edit/delete actions
- Add task form (title, description, status)
- Edit task form (title, status, description)
- Delete confirmation dialog
- Snackbar success feedback
- Loading (inline LinearProgress) and error alerts
- 404 page

# Data Model (frontend)
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

# Testing
- npm test           # runs Vitest + RTL

# Scripts
- npm dev         # start Vite dev server
- npm build       # production build
- npm preview     # serve built bundle
- npm lint        # eslint
- npm test        # vitest

# Why this design
Small, readable, and fast to run. Clear state flow, honest loading/error handling, and a modern UI.
