'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationProps {
  type?: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  type = 'success', 
  message, 
  duration = 3000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300); // Animasyon bittikten sonra onClose çağır
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };
  
  // Bildirim tipi için simge ve renk
  const iconMap = {
    success: <FaCheckCircle className="text-green-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    error: <FaTimesCircle className="text-red-500" />
  };
  
  const bgColorMap = {
    success: 'bg-green-50',
    info: 'bg-blue-50',
    warning: 'bg-yellow-50',
    error: 'bg-red-50'
  };
  
  const textColorMap = {
    success: 'text-green-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    error: 'text-red-800'
  };
  
  const borderColorMap = {
    success: 'border-green-200',
    info: 'border-blue-200',
    warning: 'border-yellow-200',
    error: 'border-red-200'
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 max-w-md shadow-lg rounded-lg border ${bgColorMap[type]} ${borderColorMap[type]} p-4`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {iconMap[type]}
            </div>
            <div className={`flex-1 ${textColorMap[type]}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button 
              onClick={handleClose}
              className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 