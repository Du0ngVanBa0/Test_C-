import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts';

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        return apiError.response?.data?.message || 'An error occurred. Please try again.';
    }
    if (err instanceof Error) {
        return err.message;
    }
    return 'An error occurred. Please try again.';
};

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');

    const { login, loginWithGoogle, register } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await register(email, password, name);
            } else {
                await login(email, password);
            }
        } catch (err: unknown) {
            console.log(err)
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setError('Google login failed. No credential received.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await loginWithGoogle(credentialResponse.credential);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <Box sx={{
            position: 'relative', minHeight: '100vh', overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Container
                component="main"
                sx={{
                    minHeight: '100vh',
                    minWidth: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        width: '100%',
                        maxWidth: 450,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease-in-out',
                        animation: 'slideIn 0.6s ease-out',
                        '@keyframes slideIn': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(50px) scale(0.9)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0) scale(1)',
                            },
                        },
                        '&:hover': {
                            transform: 'translateY(-5px) scale(1.02)',
                            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                        },
                    }}
                >
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            component="h1"
                            variant={isMobile ? 'h5' : 'h4'}
                            sx={{
                                mb: 2,
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
                            {isRegister ? 'Create Account' : 'Welcome Back'}
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    width: '100%',
                                    mb: 1,
                                    borderRadius: 2,
                                    animation: 'shake 0.5s ease-in-out',
                                    '@keyframes shake': {
                                        '0%, 100%': { transform: 'translateX(0)' },
                                        '25%': { transform: 'translateX(-5px)' },
                                        '75%': { transform: 'translateX(5px)' },
                                    },
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {isRegister && (
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                        '&.Mui-focused': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 0 20px rgba(35, 166, 213, 0.3)',
                                        },
                                    },
                                }}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            variant="outlined"
                            autoComplete="email"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                    '&.Mui-focused': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 0 20px rgba(35, 166, 213, 0.3)',
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            variant="outlined"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                    '&.Mui-focused': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 0 20px rgba(35, 166, 213, 0.3)',
                                    },
                                },
                            }}
                        />

                        <Button
                        onClick={handleSubmit}
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
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
                                '&:active': {
                                    transform: 'scale(0.98)',
                                },
                            }}
                        >
                            {loading
                                ? (isRegister ? 'Creating Account...' : 'Signing In...')
                                : (isRegister ? 'Create Account' : 'Sign In')
                            }
                        </Button>

                        <Divider sx={{ width: '100%', my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                '& > div': {
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                },
                            }}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                width={isMobile ? 280 : 320}
                                text={isRegister ? 'signup_with' : 'signin_with'}
                            />
                        </Box>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        setIsRegister(!isRegister);
                                        setError('');
                                        setEmail('');
                                        setPassword('');
                                        setName('');
                                    }}
                                    disabled={loading}
                                    sx={{
                                        ml: 1,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            background: 'linear-gradient(45deg, rgba(238, 119, 82, 0.1), rgba(231, 60, 126, 0.1))',
                                        },
                                    }}
                                >
                                    {isRegister ? 'Sign In' : 'Create Account'}
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
