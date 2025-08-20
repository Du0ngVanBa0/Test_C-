import React from 'react';
import { Box } from '@mui/material';

interface AnimatedBackgroundProps {
  particleCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ particleCount = 15 }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => i);
  
  return (
    <>
      {/* Gradient Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      />

      {/* Floating Particles */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        {particles.map((particle) => (
          <Box
            key={particle}
            sx={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-${particle} ${Math.random() * 12 + 8}s linear infinite`,
              '@keyframes float-0': {
                '0%': { transform: 'translateY(100vh) scale(0)' },
                '100%': { transform: 'translateY(-100px) scale(1)' },
              },
              '@keyframes float-1': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(30px) scale(1)' },
              },
              '@keyframes float-2': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-20px) scale(1)' },
              },
              '@keyframes float-3': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(40px) scale(1)' },
              },
              '@keyframes float-4': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-30px) scale(1)' },
              },
              '@keyframes float-5': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(25px) scale(1)' },
              },
              '@keyframes float-6': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-15px) scale(1)' },
              },
              '@keyframes float-7': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(35px) scale(1)' },
              },
              '@keyframes float-8': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-25px) scale(1)' },
              },
              '@keyframes float-9': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(20px) scale(1)' },
              },
              '@keyframes float-10': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-35px) scale(1)' },
              },
              '@keyframes float-11': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(15px) scale(1)' },
              },
              '@keyframes float-12': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-10px) scale(1)' },
              },
              '@keyframes float-13': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(45px) scale(1)' },
              },
              '@keyframes float-14': {
                '0%': { transform: 'translateY(100vh) translateX(0px) scale(0)' },
                '100%': { transform: 'translateY(-100px) translateX(-40px) scale(1)' },
              },
            }}
          />
        ))}
      </Box>
    </>
  );
};

export default AnimatedBackground;
