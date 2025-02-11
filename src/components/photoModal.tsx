'use client';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import PhotoDetail from './photoDetail';

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
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // 原本 90%，可依需求再調小
    maxWidth: 900, // 原本 1200，縮小最大寬度
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 1, // 原本 2，減少內邊距
    outline: 'none',
    borderRadius: '8px',
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <PhotoDetail photoId={photoId} />
      </Box>
    </Modal>
  );
}
