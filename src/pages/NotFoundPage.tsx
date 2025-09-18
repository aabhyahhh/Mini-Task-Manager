 
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Search as SearchIcon
} from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton 
            onClick={() => navigate('/tasks')}
            sx={{ 
              backgroundColor: '#F3F4F6',
              '&:hover': { backgroundColor: '#E5E7EB' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
            Page Not Found
          </Typography>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 200px)',
        p: 3
      }}>
        <Card sx={{ 
          maxWidth: '500px', 
          width: '100%',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: '#F3F4F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SearchIcon sx={{ fontSize: '3rem', color: '#9CA3AF' }} />
              </Box>
              
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: '#1F2937',
                mb: 2
              }}>
                404
              </Typography>
              
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: '#374151',
                mb: 2
              }}>
                Page Not Found
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ 
                lineHeight: 1.6,
                mb: 4
              }}>
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/tasks')}
                sx={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#2563EB'
                  }
                }}
              >
                Go to Tasks
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#6B7280',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                Go Back
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'white', 
        borderTop: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          Need help? Contact support or check our documentation.
        </Typography>
      </Box>
    </Box>
  );
}