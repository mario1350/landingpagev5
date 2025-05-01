import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, DollarSignIcon, PercentIcon, CalendarIcon, SunIcon, ZapIcon, BatteryChargingIcon, CheckCircleIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';
import { calculateMonthlyPayment, formatCurrency, calculateFinancialProjection } from '../../lib/utils';
import { cn } from '../../lib/utils';

// Credit score ranges
const creditScoreRanges = [
  { id: 'low', label: 'Menos de 640', value: 'low' },
  { id: 'medium', label: '640 - 670', value: 'medium' },
  { id: 'good', label: '671 - 699', value: 'good' },
  { id: 'excellent', label: '700+', value: 'excellent' }
];

// Financing terms in years
const financingTerms = [10, 15, 20, 25];

// APR rates by term and credit score
const aprRates: Record<number, Record<string, number>> = {
  10: { low: 7.99, medium: 6.49, good: 5.49, excellent: 4.99 },
  15: { low: 8.49, medium: 6.99, good: 5.69, excellent: 5.49 },
  20: { low: 9.49, medium: 7.99, good: 6.49, excellent: 6.49 },
  25: { low: 9.99, medium: 8.49, good: 6.99, excellent: 6.99 }
};

export const FinancingOptions: React.FC = () => {
  const { 
    systemSummary,
    calculationResults: initialCalculationResults,
    updateFinancialSummary,
    updateCalculationResults,
    setStep 
  } = useQuoteStore();
  
  const [selectedTerm, setSelectedTerm] = useState<number>(10);
  const [creditScore, setCreditScore] = useState<string>('excellent');
  const [isLoading, setIsLoading] = useState(false);
  const [calculationResults, setCalculationResults] = useState(initialCalculationResults);
  
  // Calculate financial details based on current selections
  const calculateFinancialDetails = () => {
    if (!systemSummary || !calculationResults) return;
    
    const interestRate = aprRates[selectedTerm][creditScore];
    const monthlyPayment = calculateMonthlyPayment(
      systemSummary.fullPrice, 
      interestRate,
      selectedTerm
    );
    
    const financialSummary = {
      creditScoreRange: creditScore,
      financingTerm: selectedTerm,
      interestRate: interestRate,
      monthlyPayment: monthlyPayment,
      totalPayments: monthlyPayment * selectedTerm * 12
    };
    
    const projection = calculateFinancialProjection(
      calculationResults.consumoDesignadoFinal,
      calculationResults.produccionMensualEstimada,
      monthlyPayment,
      25 // 25 year system lifespan
    );
    
    const newCalculationResults = {
      ...calculationResults,
      ...projection
    };
    
    return { financialSummary, newCalculationResults };
  };
  
  // Handle term selection
  const handleTermSelect = (term: number) => {
    setSelectedTerm(term);
    const results = calculateFinancialDetails();
    if (results) {
      updateFinancialSummary(results.financialSummary);
      updateCalculationResults(results.newCalculationResults);
      setCalculationResults(results.newCalculationResults);
    }
  };
  
  // Handle credit score selection
  const handleCreditScoreSelect = (score: string) => {
    setCreditScore(score);
    const results = calculateFinancialDetails();
    if (results) {
      updateFinancialSummary(results.financialSummary);
      updateCalculationResults(results.newCalculationResults);
      setCalculationResults(results.newCalculationResults);
    }
  };
  
  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(8);
    }, 1000);
  };
  
  if (!systemSummary || !calculationResults) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700">Cargando opciones de financiamiento...</p>
      </div>
    );
  }
  
  // Get the APR for the selected term and credit score
  const selectedAPR = aprRates[selectedTerm][creditScore];
  
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(
    systemSummary.fullPrice,
    selectedAPR,
    selectedTerm
  );
  
  // Get total payments
  const totalPayments = monthlyPayment * selectedTerm * 12;
  
  // Calculate first year savings
  const firstYearSavings = calculationResults.yearOneSavings;
  
  // Convert to monthly savings (approximate)
  const estimatedMonthlySavings = firstYearSavings / 12;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0 pb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Opciones de Financiamiento
      </h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Resumen del Sistema</h3>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(systemSummary.fullPrice)}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center">
              <SunIcon size={16} className="mr-1 text-yellow-500" />
              {systemSummary.panels} Paneles
            </div>
            
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center">
              <ZapIcon size={16} className="mr-1 text-blue-500" />
              {systemSummary.microinverters} Inversores
            </div>
            
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center">
              <BatteryChargingIcon size={16} className="mr-1 text-green-500" />
              Baterías
            </div>
            
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center">
              <CheckCircleIcon size={16} className="mr-1 text-success-500" />
              Instalación Incluida
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Selecciona tu Puntaje de Crédito</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {creditScoreRanges.map((range) => (
              <button
                key={range.id}
                className={cn(
                  "p-3 rounded-md text-center border-2 transition-all duration-200",
                  creditScore === range.value
                    ? "border-primary-500 bg-primary-50 font-medium"
                    : "border-gray-200 hover:border-primary-300"
                )}
                onClick={() => handleCreditScoreSelect(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Selecciona el Plazo de Financiamiento</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {financingTerms.map((term) => (
              <button
                key={term}
                className={cn(
                  "p-3 rounded-md text-center border-2 transition-all duration-200",
                  selectedTerm === term
                    ? "border-primary-500 bg-primary-50 font-medium"
                    : "border-gray-200 hover:border-primary-300"
                )}
                onClick={() => handleTermSelect(term)}
              >
                {term} Años
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-primary-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Detalles del Financiamiento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <PercentIcon size={18} className="mr-2 text-primary-500" />
                <span className="text-sm text-gray-600">Tasa de Interés (APR)</span>
              </div>
              <p className="text-2xl font-bold">{selectedAPR}%</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <CalendarIcon size={18} className="mr-2 text-primary-500" />
                <span className="text-sm text-gray-600">Plazo</span>
              </div>
              <p className="text-2xl font-bold">{selectedTerm} años</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <DollarSignIcon size={18} className="mr-2 text-primary-500" />
                <span className="text-sm text-gray-600">Pago Mensual</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</p>
            </div>
          </div>
        </div>
        
        {/* Savings Comparison */}
        <div className="mb-8 p-6 bg-success-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Comparación de Ahorros</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Pago Mensual Solar</h4>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(monthlyPayment)}</p>
              <p className="text-sm text-gray-500 mt-1">Fijo durante {selectedTerm} años</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Ahorro Mensual Estimado</h4>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(estimatedMonthlySavings)}</p>
              <p className="text-sm text-gray-500 mt-1">Aumenta con la inflación de LUMA</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">Ahorro Durante la Vida Útil</h4>
              <p className="text-xl font-bold text-success-600">{formatCurrency(calculationResults.lifetimeSavings)}</p>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-success-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, (calculationResults.lifetimeSavings / totalPayments) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">ROI en aproximadamente {calculationResults.paybackPeriod} años</p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setStep(6)}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={18} />
            Atrás
          </Button>
          
          <Button 
            type="button"
            onClick={handleContinue}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Procesando...' : 'Finalizar Cotización'}
            {!isLoading && <ArrowRightIcon size={18} />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};