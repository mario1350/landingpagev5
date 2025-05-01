import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, HelpCircleIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';

const months = [
  'Abril 2025', 'Marzo 2025', 'Febrero 2025', 'Enero 2025',
  'Diciembre 2024', 'Noviembre 2024', 'Octubre 2024', 
  'Septiembre 2024', 'Agosto 2024', 'Julio 2024',
  'Junio 2024', 'Mayo 2024', 'Abril 2024'
];

interface LocationFormValues {
  address: string;
  monthlyConsumption: number[];
}

export const LocationConsumptionForm: React.FC = () => {
  const { locationInfo, updateLocationInfo, setStep } = useQuoteStore();
  const [showConsumptionHelp, setShowConsumptionHelp] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<LocationFormValues>({
    defaultValues: locationInfo,
    mode: 'onChange'
  });

  const onSubmit = (data: LocationFormValues) => {
    updateLocationInfo(data);
    setStep(4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0 pb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Ubicación y Consumo
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección Física (Puerto Rico)
            </label>
            <input
              id="address"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.address ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="Calle, Ciudad, Código Postal"
              {...register('address', { 
                required: 'Este campo es obligatorio' 
              })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-error-500">{errors.address.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Consumo Mensual (últimos 13 meses)
              </label>
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConsumptionHelp(!showConsumptionHelp)}
              >
                <HelpCircleIcon size={16} />
              </button>
            </div>
            
            {showConsumptionHelp && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                Ingrese su consumo mensual en kWh según aparece en su factura de LUMA. 
                Esta información es clave para dimensionar correctamente su sistema solar.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {months.map((month, index) => (
                <div key={month} className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">{month}:</span>
                  <Controller
                    name={`monthlyConsumption.${index}`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <input
                        type="number"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                          errors.monthlyConsumption?.[index] ? 'border-error-500' : 'border-gray-300'
                        }`}
                        placeholder="kWh"
                        min="0"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon size={18} />
              Atrás
            </Button>
            
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