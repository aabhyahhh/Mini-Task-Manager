import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Paper,
} from '@mui/material';
 
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTasks } from '../../context/TasksContext';
// no-op

const statusConfig = {
  PENDING:     { label: 'To Do',       color: '#3B82F6', bgColor: '#F0F4FF' },
  IN_PROGRESS: { label: 'In Progress', color: '#F59E0B', bgColor: '#FFFBEB' },
  COMPLETED:   { label: 'Completed',   color: '#10B981', bgColor: '#F0FDF4' },
} as const;

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, deleteTaskById } = useTasks();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const task = state.tasks.find(t => t.id === id);

  if (!task) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Task not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/tasks')}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  const statusInfo = statusConfig[task.status as keyof typeof statusConfig];

  const handleDelete = async () => {
    try {
      await deleteTaskById(task.id);
      setDeleteDialogOpen(false);
      setSnackbarMessage('Task deleted successfully');
      setSnackbarOpen(true);
      navigate('/tasks');
    } catch (error) {
      setSnackbarMessage('Failed to delete task');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = () => {
    navigate(`/tasks/${task.id}/edit`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton 
            onClick={() => navigate('/tasks')}
            sx={{ 
              backgroundColor: '#F3F4F6',
              '&:hover': { backgroundColor: '#E5E7EB' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Board {'>'} Task Details
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
              {task.title}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              borderColor: '#D1D5DB',
              color: '#6B7280',
              textTransform: 'none',
              borderRadius: '8px'
            }}
          >
            Edit Task
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderColor: '#FCA5A5',
              color: '#DC2626',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#F87171',
                backgroundColor: '#FEF2F2'
              }
            }}
          >
            Delete Task
          </Button>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
      <Box 
  sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' },
    gap: 3
  }}
>
  {/* Main Content */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <Card sx={{ mb: 3, borderRadius: '12px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {task.description || 'No description provided for this task.'}
                </Typography>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <CommentIcon sx={{ color: '#6B7280' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Comments (3)
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  {[1, 2, 3].map((comment) => (
                    <Paper key={comment} sx={{ p: 2, backgroundColor: '#F9FAFB' }}>
                      <Stack direction="row" spacing={2}>
                        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#3B82F6' }}>
                          AT
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Abhaya Trivedi
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date().toLocaleDateString()}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Comment placeholder text.
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { xs: 1, md: 1 } }}>            <Stack spacing={3}>
              {/* Status */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Status
                  </Typography>
                  <Chip
                    label={statusInfo.label}
                    sx={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      fontWeight: 500,
                      border: `1px solid ${statusInfo.color}20`
                    }}
                  />
                </CardContent>
              </Card>

              {/* Assignee */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Assignee
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#3B82F6' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Abhaya Trivedi
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        abhayatrivedi2005@gmail.com
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Details */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Details
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <ScheduleIcon sx={{ color: '#6B7280' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Created
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(task.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <ScheduleIcon sx={{ color: '#6B7280' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AttachFileIcon sx={{ color: '#6B7280' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Attachments
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          2 files
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Progress
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#10B981', fontSize: '1.25rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      50% Complete
                    </Typography>
                  </Stack>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#E5E7EB', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '50%', 
                        height: '100%', 
                        backgroundColor: '#10B981',
                        borderRadius: '4px'
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Delete Task
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
