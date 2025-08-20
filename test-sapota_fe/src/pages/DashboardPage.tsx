import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Fab,
  Alert,
  Snackbar,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  MusicNote as MusicIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts';
import apiService from '../services/apiService';
import type { FavoriteMusic, FavoriteMusicRequest } from '../types';
import { 
  MusicForm, 
  MusicCard, 
  SearchBar 
} from '../components';

const DashboardPage: React.FC = () => {
  const { user, logout, logoutAllDevices } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [music, setMusic] = useState<FavoriteMusic[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<FavoriteMusic | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMusic = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getFavoriteMusicPaged(page, 6);
      setMusic(response.data.items);
      setTotalPages(response.data.totalPages);
      setIsSearching(false);
    } catch (error) {
      console.error('Failed to fetch music:', error);
      setSnackbar({ open: true, message: 'Failed to load music', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMusic();
  }, [fetchMusic]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      fetchMusic();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await apiService.searchFavoriteMusic(query);
      setMusic(response.data);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error('Search failed:', error);
      setSnackbar({ open: true, message: 'Search failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setPage(1);
    fetchMusic();
  };

  const handleSave = async (musicData: FavoriteMusicRequest) => {
    setLoading(true);
    try {
      if (editingMusic) {
        await apiService.updateFavoriteMusic(editingMusic.id, musicData);
        setSnackbar({ open: true, message: 'Music updated successfully!', severity: 'success' });
      } else {
        await apiService.createFavoriteMusic(musicData);
        setSnackbar({ open: true, message: 'Music added successfully!', severity: 'success' });
      }
      handleCloseDialog();
      if (isSearching) {
        handleClearSearch();
      } else {
        fetchMusic();
      }
    } catch (error) {
      console.error('Save failed:', error);
      setSnackbar({ open: true, message: 'Failed to save music', severity: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this music?')) return;

    setLoading(true);
    try {
      await apiService.deleteFavoriteMusic(id);
      setSnackbar({ open: true, message: 'Music deleted successfully!', severity: 'success' });
      if (isSearching) {
        handleClearSearch();
      } else {
        fetchMusic();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({ open: true, message: 'Failed to delete music', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (musicItem: FavoriteMusic) => {
    setEditingMusic(musicItem);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMusic(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await logoutAllDevices();
    } catch (error) {
      console.error('Logout all devices error:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>      
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          py: 4 
        }}
      >
        {/* User Profile Header */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            animation: 'slideIn 0.6s ease-out',
            '@keyframes slideIn': {
              '0%': { opacity: 0, transform: 'translateY(-30px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3,
              mb: 3,
            }}
          >
            <Avatar
              src={user?.picture}
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                fontSize: { xs: '2rem', sm: '2.5rem' },
                background: 'linear-gradient(45deg, #ee7752, #e73c7e)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 25px rgba(238, 119, 82, 0.4)',
                },
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'textGlow 3s ease-in-out infinite',
                  '@keyframes textGlow': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                Welcome, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    background: 'linear-gradient(45deg, rgba(238, 119, 82, 0.1), rgba(231, 60, 126, 0.1))',
                  },
                }}
              >
                Logout
              </Button>
              
              <Button
                variant="outlined"
                color="warning"
                startIcon={<LogoutIcon />}
                onClick={handleLogoutAllDevices}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Logout All
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Search Section */}
        <Paper
          elevation={24}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <SearchBar 
            onSearch={handleSearch} 
            onClear={handleClearSearch} 
            loading={loading}
          />
        </Paper>

        {/* Music Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress 
              size={60}
              sx={{
                color: '#ee7752',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {music.length === 0 ? (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Paper
                  elevation={12}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <MusicIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No music found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {isSearching ? 'Try different search terms' : 'Add your first favorite music to get started!'}
                  </Typography>
                </Paper>
              </Box>
            ) : (
              music.map((item) => (
                <MusicCard
                  key={item.id}
                  music={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </Box>
        )}

        {/* Pagination */}
        {!isSearching && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    background: 'linear-gradient(45deg, rgba(238, 119, 82, 0.1), rgba(231, 60, 126, 0.1))',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #ee7752, #e73c7e)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ee7752, #e73c7e)',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add music"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5)',
          backgroundSize: '200% 200%',
          animation: 'buttonGlow 3s ease-in-out infinite',
          transition: 'all 0.3s ease',
          '@keyframes buttonGlow': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(238, 119, 82, 0.4)',
          },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Music Form Dialog */}
      <MusicForm
        open={dialogOpen}
        editingMusic={editingMusic}
        onClose={handleCloseDialog}
        onSave={handleSave}
        loading={loading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
