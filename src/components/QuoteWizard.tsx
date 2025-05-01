import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuoteStore } from '../context/QuoteContext';
import { HeroSection } from './steps/HeroSection';
import { ContactForm } from './steps/ContactForm';
import { LocationConsumptionForm } from './steps/LocationConsumptionForm';
import { BillUploadForm } from './steps/BillUploadForm';
import { RoofTypeSelector } from './steps/RoofTypeSelector';
import { LoadingScreen } from './steps/LoadingScreen';
import { SystemSummary } from './steps/SystemSummary';
import { FinancingOptions } from './steps/FinancingOptions';
import { FinalDetails } from './steps/FinalDetails';
import { ProgressIndicator } from './ui/ProgressIndicator';

export const QuoteWizard: React.FC = () => {
  const { step, setStep } = useQuoteStore();
  const [isCalculating, setIsCalculating] = useState(false);

  // Complete calculations after roof type step
  useEffect(() => {
    if (step === 5) {
      setIsCalculating(true);
      // Simulate calculation time
      const timer = setTimeout(() => {
        setIsCalculating(false);
        setStep(6); // Move to system summary
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);

  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -100,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  // Render the current step
  const renderStep = () => {
    if (isCalculating) {
      return <LoadingScreen message="Generando tu propuesta personalizada..." />;
    }

    switch (step) {
      case 1:
        return <HeroSection />;
      case 2:
        return <ContactForm />;
      case 3:
        return <LocationConsumptionForm />;
      case 4:
        return <BillUploadForm />;
      case 5:
        return <RoofTypeSelector />;
      case 6:
        return <SystemSummary />;
      case 7:
        return <FinancingOptions />;
      case 8:
        return <FinalDetails />;
      default:
        return <HeroSection />;
    }
  };

  // Calculate the total number of steps
  const totalSteps = 8;

  return (
    <div className="min-h-screen bg-gray-50">
      {step > 1 && step < 8 && (
        <ProgressIndicator currentStep={step - 1} totalSteps={totalSteps - 2} />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full min-h-[calc(100vh-56px)]"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};