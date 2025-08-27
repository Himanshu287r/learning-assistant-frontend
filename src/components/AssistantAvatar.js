import React from 'react';
import { Avatar, Box } from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(0.92); opacity: 0.22; }
  50% { transform: scale(1.06); opacity: 0.42; }
  100% { transform: scale(0.92); opacity: 0.22; }
`;

const AssistantAvatar = ({ size = 32, ariaLabel = 'Learning Assistant avatar', sx = {}, ...props }) => {
  const iconSize = Math.round(size * 0.62);

  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Gradient ring */}
      <Box aria-hidden sx={{
        position: 'absolute',
        inset: -2,
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #64b5f6, #ab47bc, #4db6ac, #64b5f6)'
      }} />

      {/* Core avatar */}
      <Avatar role="img" aria-label={ariaLabel} sx={{
        width: size,
        height: size,
        bgcolor: 'rgba(255,255,255,0.14)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        boxShadow: '0 0 0 2px rgba(255,255,255,0.12) inset, 0 8px 20px rgba(16,24,40,0.35)',
        ...sx,
      }} {...props}>
        <SmartToyRoundedIcon sx={{ fontSize: iconSize }} />
      </Avatar>

      {/* Soft glow pulse */}
      <Box aria-hidden sx={{
        position: 'absolute',
        width: size + 14,
        height: size + 14,
        borderRadius: '50%',
        opacity: 0.25,
        background: 'radial-gradient(circle, rgba(99,102,241,0.7), rgba(99,102,241,0) 60%)',
        animation: `${pulse} 3200ms ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
    </Box>
  );
};

export default AssistantAvatar;