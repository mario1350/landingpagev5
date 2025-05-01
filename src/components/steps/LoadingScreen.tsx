import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunIcon } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Procesando...' 
}) => {
  const [progress, setProgress] = useState(0);
  const [waitingMessage, setWaitingMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);
    
    const waitingTimeout = setTimeout(() => {
      setWaitingMessage('Estamos tardando un poco; ¡gracias por tu paciencia!');
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(waitingTimeout);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-8"
      >
        <SunIcon className="w-16 h-16 text-yellow-400" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {message}
      </h2>
      
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-primary-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <p className="text-gray-600 text-center mb-8">
        {Math.floor(progress)}% completado
      </p>
      
      {waitingMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center italic"
        >
          {waitingMessage}
        </motion.p>
      )}
    </div>
  );
};