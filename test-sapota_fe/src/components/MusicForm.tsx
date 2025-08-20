import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import type { FavoriteMusic, FavoriteMusicRequest } from '../types';

interface MusicFormProps {
  open: boolean;
  editingMusic: FavoriteMusic | null;
  onClose: () => void;
  onSave: (musicData: FavoriteMusicRequest) => Promise<void>;
  loading: boolean;
}

const MusicForm: React.FC<MusicFormProps> = ({
  open,
  editingMusic,
  onClose,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<FavoriteMusicRequest>({
    title: '',
    artist: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingMusic) {
      setFormData({
        title: editingMusic.title,
        artist: editingMusic.artist,
      });
    } else {
      setFormData({
        title: '',
        artist: '',
      });
    }
    setErrors({});
  }, [editingMusic, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await onSave(formData);
  };

  const handleFieldChange = (field: keyof FavoriteMusicRequest, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      }}
    >
      <DialogTitle 
        sx={{
          background: 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
          animation: 'textGlow 3s ease-in-out infinite',
          '@keyframes textGlow': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        {editingMusic ? 'Edit Music' : 'Add New Music'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Title *"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' },
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 20px rgba(35, 166, 213, 0.3)',
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Artist *"
            value={formData.artist}
            onChange={(e) => handleFieldChange('artist', e.target.value)}
            error={!!errors.artist}
            helperText={errors.artist}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' },
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 20px rgba(35, 166, 213, 0.3)',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 2,
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
              transform: 'scale(1.05)',
              boxShadow: '0 8px 25px rgba(238, 119, 82, 0.4)',
            },
          }}
        >
          {loading ? 'Saving...' : (editingMusic ? '💾 Update' : 'Add Music')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MusicForm;
