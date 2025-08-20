import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 2,
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ee7752, #e73c7e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          flex: 1,
        }}
      >
        🎶 My Favorite Music
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search music..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{
            minWidth: 200,
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
        
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
          sx={{
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          Search
        </Button>

        {searchTerm && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={loading}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;
