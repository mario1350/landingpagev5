import React, { createContext, useContext, useState } from 'react';
import { create } from 'zustand';

// Define the types for our store
type QuoteState = {
  step: number;
  maxStep: number;
  contactInfo: {
    name: string;
    phone: string;
  };
  locationInfo: {
    address: string;
    monthlyConsumption: number[];
  };
  billFiles: File[];
  roofType: string;
  metalSubtype: string | null;
  systemSummary: {
    panels: number;
    microinverters: number;
    batterySolution: string;
    installationIncluded: boolean;
    fullPrice: number;
  } | null;
  financialSummary: {
    creditScoreRange: string;
    financingTerm: number;
    interestRate: number;
    monthlyPayment: number;
    totalPayments: number;
  } | null;
  calculationResults: {
    consumoDesignadoFinal: number;
    produccionMensualEstimada: number;
    coveragePercent: number;
    yearOneSavings: number;
    lifetimeSavings: number;
    paybackPeriod: number;
    yearlySavings: number[];
    cumulativeSavings: number[];
  } | null;
  
  // Actions
  setStep: (step: number) => void;
  updateContactInfo: (info: Partial<QuoteState['contactInfo']>) => void;
  updateLocationInfo: (info: Partial<QuoteState['locationInfo']>) => void;
  updateBillFiles: (files: File[]) => void;
  updateRoofType: (type: string) => void;
  updateMetalSubtype: (subtype: string | null) => void;
  updateSystemSummary: (summary: QuoteState['systemSummary']) => void;
  updateFinancialSummary: (summary: QuoteState['financialSummary']) => void;
  updateCalculationResults: (results: QuoteState['calculationResults']) => void;
  reset: () => void;
};

// Create the store
export const useQuoteStore = create<QuoteState>((set) => ({
  step: 1,
  maxStep: 1,
  contactInfo: {
    name: '',
    phone: '',
  },
  locationInfo: {
    address: '',
    monthlyConsumption: Array(13).fill(0),
  },
  billFiles: [],
  roofType: '',
  metalSubtype: null,
  systemSummary: null,
  financialSummary: null,
  calculationResults: null,
  
  // Actions
  setStep: (step) => set((state) => ({ 
    step,
    maxStep: Math.max(state.maxStep, step)
  })),
  updateContactInfo: (info) => set((state) => ({ 
    contactInfo: { ...state.contactInfo, ...info } 
  })),
  updateLocationInfo: (info) => set((state) => ({ 
    locationInfo: { ...state.locationInfo, ...info } 
  })),
  updateBillFiles: (files) => set({ billFiles: files }),
  updateRoofType: (type) => set({ roofType: type }),
  updateMetalSubtype: (subtype) => set({ metalSubtype: subtype }),
  updateSystemSummary: (summary) => set({ systemSummary: summary }),
  updateFinancialSummary: (summary) => set({ financialSummary: summary }),
  updateCalculationResults: (results) => set({ calculationResults: results }),
  reset: () => set({
    step: 1,
    maxStep: 1,
    contactInfo: {
      name: '',
      phone: '',
    },
    locationInfo: {
      address: '',
      monthlyConsumption: Array(13).fill(0),
    },
    billFiles: [],
    roofType: '',
    metalSubtype: null,
    systemSummary: null,
    financialSummary: null,
    calculationResults: null,
  }),
}));

// Create context for components that don't want to use the store directly
type QuoteContextType = {
  state: QuoteState;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useQuoteStore();
  
  return (
    <QuoteContext.Provider value={{ state }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuoteContext = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuoteContext must be used within a QuoteProvider');
  }
  return context;
};