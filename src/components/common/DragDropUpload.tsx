import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFileSelect,
  accept = 'image/*,video/*',
  maxSize = 60 * 1024 * 1024, // 60MB
  disabled = false,
  multiple = false,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
      setDragActive(false);
    },
    [onFileSelect]
  );

  const onDropRejected = useCallback(() => {
    setDragActive(false);
    alert('檔案格式不支援或檔案過大（最大 60MB）');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    },
    maxSize,
    multiple,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer transition-all duration-200 ease-in-out
        border-2 border-dashed rounded-xl p-8 text-center
        ${isDragActive || dragActive
          ? 'border-blue-500 bg-blue-50 scale-[1.02]'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        {isDragActive || dragActive ? (
          <>
            <CloudArrowUpIcon className="mx-auto h-16 w-16 text-blue-500" />
            <div>
              <p className="text-lg font-medium text-blue-600">
                放開以上傳檔案
              </p>
              <p className="text-sm text-blue-500">
                支援照片和影片檔案
              </p>
            </div>
          </>
        ) : (
          <>
            <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                拖拽照片到這裡或點擊選擇
              </p>
              <p className="text-sm text-gray-500 mt-1">
                支援 JPG、PNG、GIF、MP4 等格式，最大 60MB
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                選擇檔案
              </span>
            </div>
          </>
        )}
      </div>
      
      {/* Mobile-friendly tap indicator */}
      <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 pointer-events-none transition-opacity duration-200 md:hidden" 
           style={{ 
             opacity: isDragActive || dragActive ? 0.1 : 0 
           }} 
      />
    </div>
  );
};