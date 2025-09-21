import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedContainer = styled(Box)(({ animationType, delay = 0 }) => {
  const animations = {
    fadeInUp: `${fadeInUp} 0.6s ease-out ${delay}s both`,
    fadeInScale: `${fadeInScale} 0.5s ease-out ${delay}s both`,
    slideInLeft: `${slideInLeft} 0.7s ease-out ${delay}s both`,
  };

  return {
    animation: animations[animationType] || animations.fadeInUp,
  };
});

const PageTransition = ({ 
  children, 
  animationType = 'fadeInUp', 
  delay = 0,
  sx = {},
  ...props 
}) => {
  return (
    <AnimatedContainer 
      animationType={animationType} 
      delay={delay}
      sx={sx}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};

export default PageTransition;