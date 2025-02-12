'use client';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade'; // 新增：使用淡入淡出的動畫
import PhotoDetail from './photoDetail';
import { IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';

interface PhotoModalProps {
  open: boolean;
  onClose: () => void;
  photoId: string;
}

export default function PhotoModal({
  open,
  onClose,
  photoId,
}: PhotoModalProps) {
  const boxStyle = {
    background: 'linear-gradient(to bottom right, #ffffff, #f7f7f7)',
    boxShadow: '0 0 12px rgba(255,255,255,0.2)',
    position: 'absolute' as const,
    p: 3,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', md: '70%' },
    maxWidth: 900,
    bgcolor: 'background.paper',
    borderRadius: 2,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #e2e2e2',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f0f0f0',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#ccc',
      borderRadius: '8px',
      '&:hover': {
        background: '#aaa',
      },
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={boxStyle}>
          <div className="flex justify-end">
            <IconButton onClick={onClose} size="small">
              <MdClose
                size={20}
                className="text-gray-500 hover:text-gray-700"
              />
            </IconButton>
          </div>

          <PhotoDetail photoId={photoId} />
        </Box>
      </Fade>
    </Modal>
  );
}
