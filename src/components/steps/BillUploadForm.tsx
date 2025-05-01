import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, UploadIcon, XIcon, FileIcon, CheckIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';

export const BillUploadForm: React.FC = () => {
  const { billFiles, updateBillFiles, setStep } = useQuoteStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only keep the first two files or replace existing ones
    const newFiles = [...billFiles];
    acceptedFiles.forEach((file, index) => {
      if (index < 2) {
        newFiles[index] = file;
      }
    });
    
    // Ensure we only have max 2 files
    updateBillFiles(newFiles.slice(0, 2));
  }, [billFiles, updateBillFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
    maxFiles: 2
  });

  const removeFile = (index: number) => {
    const newFiles = [...billFiles];
    newFiles.splice(index, 1);
    updateBillFiles(newFiles);
  };

  const handleContinue = () => {
    setStep(5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Sube tu factura de LUMA
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Por favor, sube la primera y cuarta página de tu factura más reciente de LUMA Energy.
            Estas páginas contienen toda la información necesaria para generar tu cotización.
          </p>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-300'
            }`}
          >
            <input {...getInputProps()} />
            
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            
            <p className="mt-4 text-sm text-gray-600">
              Arrastra y suelta tus archivos aquí, o haz clic para seleccionar
            </p>
            
            <p className="mt-2 text-xs text-gray-500">
              Formatos aceptados: JPG, PNG, PDF (máximo 2 archivos)
            </p>
          </div>
          
          {billFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Archivos subidos:</p>
              
              <div className="space-y-2">
                {billFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-success-500 mr-2" />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-error-500"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setStep(3)}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={18} />
            Atrás
          </Button>
          
          <Button 
            type="button"
            onClick={handleContinue}
            disabled={billFiles.length === 0}
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