import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';

interface ContactFormValues {
  name: string;
  phone: string;
}

export const ContactForm: React.FC = () => {
  const { contactInfo, updateContactInfo, setStep } = useQuoteStore();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ContactFormValues>({
    defaultValues: contactInfo,
    mode: 'onChange'
  });

  const onSubmit = (data: ContactFormValues) => {
    updateContactInfo(data);
    setStep(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto pt-10 sm:pt-20 px-4 sm:px-0"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Información de contacto
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.name ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="Nombre completo"
              {...register('name', { 
                required: 'Este campo es obligatorio' 
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.phone ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="+1 (___) ___-____"
              {...register('phone', { 
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\+?[0-9]{7,15}$/,
                  message: 'Número de teléfono inválido'
                }
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error-500">{errors.phone.message}</p>
            )}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit"
              disabled={!isValid}
              className="flex items-center gap-2"
            >
              Continuar
              <ArrowRightIcon size={18} />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};