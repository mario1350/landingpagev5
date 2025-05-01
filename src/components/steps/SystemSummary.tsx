import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, ZapIcon, SunIcon, BatteryChargingIcon, ActivityIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';
import { calculateSolarSystem, getSystemComponents, formatCurrency } from '../../lib/utils';

export const SystemSummary: React.FC = () => {
  const { 
    locationInfo, 
    updateSystemSummary,
    updateCalculationResults,
    systemSummary,
    setStep 
  } = useQuoteStore();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Calculate system parameters
    const monthlyConsumption = locationInfo.monthlyConsumption.filter(m => m > 0);
    
    if (monthlyConsumption.length === 0) {
      // Use default values if no consumption data
      monthlyConsumption.push(500);
    }
    
    const systemParams = calculateSolarSystem(monthlyConsumption);
    const { components, pricing, categories, retailPrice } = getSystemComponents(systemParams.numeroPanelesFinal);
    
    // Update system summary in store
    updateSystemSummary({
      panels: systemParams.numeroPanelesFinal,
      microinverters: (components['HMS-2000 4T'] as number) + (components['HMS-1000 2T'] as number),
      batterySolution: 'FranklinWh',
      installationIncluded: true,
      fullPrice: retailPrice,
    });
    
    // Update calculation results
    updateCalculationResults({
      consumoDesignadoFinal: systemParams.consumoDesignadoFinal,
      produccionMensualEstimada: systemParams.produccionMensual,
      coveragePercent: (systemParams.produccionMensual / systemParams.consumoDesignadoFinal) * 100,
      yearOneSavings: 0, // Will be calculated in financing step
      lifetimeSavings: 0, // Will be calculated in financing step
      paybackPeriod: 0, // Will be calculated in financing step
      yearlySavings: [],
      cumulativeSavings: [],
    });
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [locationInfo, updateSystemSummary, updateCalculationResults]);
  
  if (isLoading || !systemSummary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold text-gray-700"
        >
          Procesando datos...
        </motion.div>
      </div>
    );
  }
  
  // System components for display
  const systemComponents = [
    {
      name: 'Paneles',
      value: `${systemSummary.panels}x Seraphim 550W`,
      icon: <SunIcon className="h-5 w-5 text-yellow-500" />,
    },
    {
      name: 'Microinversores',
      value: `Hoymiles HMS (${systemSummary.microinverters})`,
      icon: <ZapIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      name: 'Baterías',
      value: 'FranklinWh aPower + aGate',
      icon: <BatteryChargingIcon className="h-5 w-5 text-green-500" />,
    },
    {
      name: 'Sistema (kW)',
      value: `${(systemSummary.panels * 0.55).toFixed(2)} kW`,
      icon: <ActivityIcon className="h-5 w-5 text-purple-500" />,
    },
  ];
  
  // Calculate monthly savings (simplified for now, will be refined in financing step)
  const estimatedMonthlyProduction = systemSummary.panels * 0.55 * 0.944 * 4.385 * 30;
  const currentElectricityRate = 0.2549; // Current LUMA rate as of April 2025
  const estimatedMonthlySavings = estimatedMonthlyProduction * currentElectricityRate;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0 pb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Tu Sistema Solar Personalizado
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {systemComponents.map((component, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="mr-4 p-2 bg-white rounded-full shadow-sm">
                  {component.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{component.name}</p>
                  <p className="font-semibold">{component.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Producción y Ahorros Estimados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Producción Mensual</p>
                <p className="text-2xl font-bold">{Math.round(estimatedMonthlyProduction)} kWh</p>
              </div>
              
              <div className="p-4 bg-success-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cobertura Estimada</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
              
              <div className="p-4 bg-accent-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Ahorro Mensual Potencial</p>
                <p className="text-2xl font-bold">{formatCurrency(estimatedMonthlySavings)}</p>
                <p className="text-xs text-gray-500 mt-1">Basado en tarifa actual de LUMA</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-xl font-bold mb-2 md:mb-0">Inversión Total</h3>
            <p className="text-3xl font-bold text-primary-600">{formatCurrency(systemSummary.fullPrice)}</p>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Incluye paneles, inversores, baterías, instalación, permisos y material eléctrico.
          </p>
          
          <div className="p-4 bg-accent-50 border border-accent-200 rounded-md">
            <p className="font-medium text-accent-800 mb-2">Beneficios incluidos:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-accent-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                25 años de garantía completa
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Instalación profesional certificada
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Trámites de permisos incluidos
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Monitoreo del sistema 24/7
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setStep(5)}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={18} />
            Atrás
          </Button>
          
          <Button 
            type="button"
            onClick={() => setStep(7)}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600"
          >
            Ver Opciones de Financiamiento
            <ArrowRightIcon size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};