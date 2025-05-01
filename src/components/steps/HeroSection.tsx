import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const { setStep } = useQuoteStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const wordVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  // Split headline text into words for animation
  const headlineWords = ["Cotiza", "tu", "propio", "sistema", "solar", "y", "recibe", "precio", "INMEDIATO"];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 opacity-90 z-0"></div>
      
      {/* Animated sun rays */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="sunRays" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="yellow" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.circle
            cx="50"
            cy="50"
            r="10"
            fill="url(#sunRays)"
            initial={{ r: 0 }}
            animate={{ r: 80 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div
          className="flex justify-center mb-8"
          variants={childVariants}
        >
          <SunIcon className="w-16 h-16 text-yellow-400" />
        </motion.div>
        
        <div className="overflow-hidden mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 flex flex-wrap justify-center">
            {headlineWords.map((word, i) => (
              <motion.span 
                key={i}
                className="inline-block mx-2"
                variants={wordVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ delay: i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>
        
        <motion.p 
          className="text-xl sm:text-2xl text-white mb-10 animate-pulse"
          variants={childVariants}
        >
          Sin vendedores. Sin comisiones. Sin Leasing/PPA
        </motion.p>
        
        <motion.div variants={childVariants}>
          <Button
            id="start-quote-btn"
            variant="accent"
            size="xl"
            onClick={() => setStep(2)}
            className="transform transition-transform hover:scale-105"
          >
            Comenzar ahora
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};