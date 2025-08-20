import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Album as AlbumIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { FavoriteMusic } from '../types';

interface MusicCardProps {
  music: FavoriteMusic;
  onEdit: (music: FavoriteMusic) => void;
  onDelete: (id: string) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ music, onEdit, onDelete }) => {
  return (
    <Card
      elevation={12}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.5)',
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AlbumIcon sx={{ mr: 1, color: '#e73c7e' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {music.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 1, color: '#23a6d5', fontSize: 20 }} />
          <Typography variant="body1" color="text.secondary">
            {music.artist}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(music)}
            sx={{
              color: '#23a6d5',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                background: 'rgba(35, 166, 213, 0.1)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => onDelete(music.id)}
            sx={{
              color: '#e73c7e',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                background: 'rgba(231, 60, 126, 0.1)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {music.createdAt && (
          <Typography variant="caption" color="text.secondary">
            Added: {new Date(music.createdAt).toLocaleDateString()}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default MusicCard;
