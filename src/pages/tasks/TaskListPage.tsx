import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  TextField, 
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  Stack,
  Paper,
  Alert, 
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TasksContext';
import type { TaskStatus } from '../../utils/types';
import { useCallback } from 'react';

const statusConfig = {
  PENDING: { 
    label: 'To Do', 
    color: '#3B82F6', 
    bgColor: '#F8FAFC',
    count: 0 
  },
  IN_PROGRESS: { 
    label: 'In Progress', 
    color: '#F59E0B', 
    bgColor: '#FFFBEB',
    count: 0 
  },
  COMPLETED: { 
    label: 'Completed', 
    color: '#10B981', 
    bgColor: '#F0FDF4',
    count: 0 
  }
};

export default function TaskListPage() {
  const { state, dispatch } = useTasks();
  const navigate = useNavigate();

  const handleSearchChange = useCallback(
       (e: React.ChangeEvent<HTMLInputElement>) => {
         dispatch({ type: 'SET_SEARCH', payload: e.target.value });
       },
       [dispatch]
     );

  // Group tasks by status
  const tasksByStatus = state.tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, typeof state.tasks>);

  // Update counts
  Object.keys(statusConfig).forEach(status => {
    statusConfig[status as TaskStatus].count = tasksByStatus[status as TaskStatus]?.length || 0;
  });

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleAddTask = (status: TaskStatus) => {
    navigate(`/tasks/new?status=${status}`);
  };

  const TaskCard = ({ task }: { task: typeof state.tasks[0] }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
      onClick={() => handleTaskClick(task.id)}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
          Client: {task.title.split(' ')[0]}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '0.95rem' }}>
          {task.title}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            <PersonIcon sx={{ fontSize: '0.875rem' }} />
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            Abhaya Trivedi
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label="Web" 
            size="small" 
            sx={{ 
              backgroundColor: '#3B82F6', 
              color: 'white',
              fontSize: '0.7rem',
              height: '20px'
            }} 
          />
          <Chip 
            label="SaaS" 
            size="small" 
            sx={{ 
              backgroundColor: '#F59E0B', 
              color: 'white',
              fontSize: '0.7rem',
              height: '20px'
            }} 
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <AttachFileIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              50%
            </Typography>
            <CommentIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              3
            </Typography>
            <ScheduleIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const StatusColumn = ({ status, config }: { status: TaskStatus; config: typeof statusConfig[TaskStatus] }) => (
    <Box sx={{ flex: 1, minWidth: '280px' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          backgroundColor: config.bgColor,
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: '4px', 
                height: '20px', 
                backgroundColor: config.color,
                borderRadius: '2px'
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {config.label}
            </Typography>
            <Chip 
              label={config.count} 
              size="small" 
              sx={{ 
                backgroundColor: config.color,
                color: 'white',
                fontSize: '0.75rem',
                height: '20px',
                minWidth: '20px'
              }} 
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => handleAddTask(status)}>
              <AddIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>
            <IconButton size="small">
              <MoreVertIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
        </Box>

        <Box>
          {tasksByStatus[status]?.length > 0 ? (
            tasksByStatus[status].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                color: 'text.secondary'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <AddIcon sx={{ fontSize: '1.5rem', color: '#9CA3AF' }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  No tasks in this column
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click the + button to add a new task
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Board {''} Overview
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
              Project UI/UX
            </Typography>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['Board'].map((tab, index) => (
            <Button
              key={tab}
              variant={index === 0 ? 'contained' : 'text'}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                py: 1,
                backgroundColor: index === 0 ? '#F3F4F6' : 'transparent',
                color: index === 0 ? '#1F2937' : '#6B7280',
                fontWeight: index === 0 ? 600 : 400,
                '&:hover': {
                  backgroundColor: index === 0 ? '#F3F4F6' : '#F9FAFB'
                }
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 3, backgroundColor: 'white' }}>
      {state.loading && <LinearProgress sx={{ mt: 2, maxWidth: 400 }} />}

      {state.error && (
      <Alert severity="error" sx={{ mt: 2, maxWidth: 400 }}>
      {state.error}
       </Alert>
      )}
        <TextField
          placeholder="Search tasks..."
          value={state.search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: '400px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#F9FAFB',
              '& fieldset': {
                borderColor: '#E5E7EB'
              },
              '&:hover fieldset': {
                borderColor: '#D1D5DB'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3B82F6'
              }
            }
          }}
        />
      </Box>

      {/* Kanban Board */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
          {Object.entries(statusConfig).map(([status, config]) => (
            <StatusColumn 
              key={status} 
              status={status as TaskStatus} 
              config={config} 
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}