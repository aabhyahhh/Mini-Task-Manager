import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useTasks } from '../../context/TasksContext';
 

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(1000, 'Description must be under 1000 characters').optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const)});
    

type TaskFormData = z.infer<typeof taskSchema>;

const statusOptions = [
  { value: 'PENDING', label: 'To Do', color: '#3B82F6' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B' },
  { value: 'COMPLETED', label: 'Completed', color: '#10B981' }
];

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateTaskById } = useTasks();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = state.tasks.find(t => t.id === id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description:'',
      status: 'PENDING'
    }
  });

  useEffect(() => {
    if (task) {
        reset({ title: task.title, description: task.description ?? '', status: task.status });

    }
  }, [task, reset]);

  if (!task) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading task...
        </Typography>
      </Box>
    );
  }

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await updateTaskById(task.id, {
        title: data.title,
        status: data.status,
        description: (data.description ?? '').trim() || undefined,
    });
      setSnackbarMessage('Task updated successfully');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(`/tasks/${task.id}`);
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to update task');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton 
            onClick={() => navigate(`/tasks/${task.id}`)}
            sx={{ 
              backgroundColor: '#F3F4F6',
              '&:hover': { backgroundColor: '#E5E7EB' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Board {'>'} Task Details {'>'} Edit
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
              Edit Task
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Form */}
      <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        <Card sx={{ borderRadius: '12px' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {/* Title Field */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Task Title"
                      placeholder="Enter task title..."
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
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
                  )}
                />

                {/* Description Field */}
                <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="Description"
                    placeholder="Enter a description..."
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                        '&.Mui-focused fieldset': { borderColor: '#3B82F6' }
                        }
                    }}
                    />
                )}
                />

                {/* Status Field */}
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        {...field}
                        label="Status"
                        sx={{
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#E5E7EB'
                          },
                          '&:hover fieldset': {
                            borderColor: '#D1D5DB'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3B82F6'
                          }
                        }}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: option.color
                                }}
                              />
                              <Typography>{option.label}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    sx={{
                      borderColor: '#D1D5DB',
                      color: '#6B7280',
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 3
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={<SaveIcon />}
                    sx={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#2563EB'
                      }
                    }}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Task'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card sx={{ mt: 3, borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              ℹ️ Edit Information
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                • You can only edit the title and status of this task
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Description changes are not supported in this version
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • The task will be automatically updated with the current timestamp
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>

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
