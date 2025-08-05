import { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all duration-300 ${
        type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
      role="alert"
    >
      {type === 'success' ? (
        <CheckCircleIcon className="w-5 h-5 text-green-600" />
      ) : (
        <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
