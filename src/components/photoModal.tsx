'use client';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import PhotoDetail from './photoDetail';
import { IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';
import { useEffect, useState } from 'react';

interface PhotoModalProps {
  open: boolean;
  onClose: () => void;
  photoId: string;
  setModalPhotoId: (photoId: string) => void;
}

export default function PhotoModal({
  open,
  onClose,
  photoId,
  setModalPhotoId,
}: PhotoModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const boxStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '100%', md: '90%' },
    height: { xs: '100%', md: '90vh' },
    maxWidth: 1400,
    minWidth: { xs: 'auto', md: 1000 },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    bgcolor: '#ffffff',
    outline: 'none',
    overflow: 'hidden',
    borderRadius: { xs: 0, md: 3 },
    boxShadow: { xs: 'none', md: '0 0 20px rgba(0,0,0,0.2)' },
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientY > window.innerHeight - 100) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableAutoFocus
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={boxStyle}
          onTouchStart={handleTouchStart}
          className="instagram-modal"
        >
          {isMobile ? (
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 bg-white/90 backdrop-blur">
              <div className="w-8" /> {/* Spacer */}
              <div className="w-20 h-1 rounded-full bg-gray-300 mx-auto" />
              <IconButton
                onClick={onClose}
                size="small"
                className="text-black/90 hover:text-black active:text-black/70 bg-black"
              >
                <MdClose size={24} className="drop-shadow-sm" />
              </IconButton>
            </div>
          ) : (
            <div className="absolute top-4 right-4 z-[60]">
              <IconButton
                onClick={onClose}
                size="small"
                className="bg-black hover:bg-black/80 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <MdClose size={24} className="drop-shadow-md" />
              </IconButton>
            </div>
          )}

          <PhotoDetail
            photoId={photoId}
            setModalPhotoId={setModalPhotoId}
            isMobile={isMobile}
          />
        </Box>
      </Fade>
    </Modal>
  );
}
