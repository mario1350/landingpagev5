import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

// Roof type options
const roofTypes = [
  { id: 'asphalt', label: 'Asphalt Shingle', icon: '🏠' },
  { id: 'tile', label: 'Tile', icon: '🏛️' },
  { id: 'metal', label: 'Metal', icon: '🏭' },
  { id: 'flat', label: 'Flat', icon: '📦' },
  { id: 'ground', label: 'Ground Mount', icon: '🌱' },
];

// Metal roof subtypes
const metalSubtypes = [
  { id: 'standing_seam', label: 'Standing Seam', icon: '📏' },
  { id: 'corrugated', label: 'Corrugated', icon: '〰️' },
  { id: 'metal_shingle', label: 'Metal Shingle', icon: '🔲' },
  { id: 'not_sure', label: 'Not Sure', icon: '❓' },
];

export const RoofTypeSelector: React.FC = () => {
  const { roofType, metalSubtype, updateRoofType, updateMetalSubtype, setStep } = useQuoteStore();
  const [selectedRoofType, setSelectedRoofType] = useState<string>(roofType);
  const [selectedMetalSubtype, setSelectedMetalSubtype] = useState<string | null>(metalSubtype);
  
  const handleRoofTypeSelect = (type: string) => {
    setSelectedRoofType(type);
    if (type !== 'metal') {
      setSelectedMetalSubtype(null);
    }
  };

  const handleMetalSubtypeSelect = (subtype: string) => {
    setSelectedMetalSubtype(subtype);
  };

  const handleContinue = () => {
    updateRoofType(selectedRoofType);
    updateMetalSubtype(selectedMetalSubtype);
    setStep(6);
  };

  const isValid = selectedRoofType && (selectedRoofType !== 'metal' || selectedMetalSubtype);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Selecciona el tipo de techo
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Este dato nos ayuda a determinar la mejor instalación para tu sistema solar.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4" role="radiogroup">
            {roofTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  selectedRoofType === type.id
                    ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500"
                    : "border-gray-200 hover:border-primary-300"
                )}
                onClick={() => handleRoofTypeSelect(type.id)}
                role="radio"
                aria-checked={selectedRoofType === type.id}
              >
                <span className="text-3xl mb-2">{type.icon}</span>
                <span className="text-sm text-center font-medium">{type.label}</span>
              </motion.div>
            ))}
          </div>
          
          {selectedRoofType === 'metal' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <p className="text-gray-600 mb-4">
                Selecciona el subtipo de techo metálico:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="radiogroup">
                {metalSubtypes.map((subtype) => (
                  <motion.div
                    key={subtype.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                      selectedMetalSubtype === subtype.id
                        ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    onClick={() => handleMetalSubtypeSelect(subtype.id)}
                    role="radio"
                    aria-checked={selectedMetalSubtype === subtype.id}
                  >
                    <span className="text-3xl mb-2">{subtype.icon}</span>
                    <span className="text-sm text-center font-medium">{subtype.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setStep(4)}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={18} />
            Atrás
          </Button>
          
          <Button 
            type="button"
            onClick={handleContinue}
            disabled={!isValid}
            className="flex items-center gap-2"
          >
            Continuar
            <ArrowRightIcon size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};