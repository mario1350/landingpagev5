import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Calculate monthly payment for loan
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const termMonths = termYears * 12;
  
  if (monthlyRate === 0) {
    return loanAmount / termMonths;
  }
  
  return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
}

// Function to calculate solar system parameters based on consumption
export function calculateSolarSystem(monthlyConsumption: number[]): {
  consumoDesignadoFinal: number;
  numeroPanelesFinal: number;
  sistemaBaseKW: number;
  sistemaAjustado: number;
  produccionDiaria: number;
  produccionMensual: number;
} {
  // Calculate average and maximum consumption
  const consumoPromedio = 
    monthlyConsumption.reduce((sum, curr) => sum + curr, 0) / monthlyConsumption.length;
  const consumoMaximo = Math.max(...monthlyConsumption);
  
  // Determine final consumption
  let consumoDesignadoFinal;
  if (consumoMaximo - consumoPromedio > 100) {
    consumoDesignadoFinal = ((consumoMaximo + consumoPromedio) / 2) * 1.15;
  } else {
    consumoDesignadoFinal = consumoMaximo;
  }
  
  // Calculate daily and annual consumption
  const consumoDiario = consumoDesignadoFinal / 30;
  const consumoAnual = consumoDesignadoFinal * 13;
  
  // Solar production parameters
  const horasSolAnio = 4.385 * 365; // 1600.525
  
  // Base production calculations
  const produccionBaseHora = consumoAnual / horasSolAnio;
  
  // Calculate number of panels
  const numeroPanelesPreliminiar = Math.ceil((produccionBaseHora * 1000) / 550);
  const numeroPanelesFinal = 
    numeroPanelesPreliminiar % 2 === 1 ? numeroPanelesPreliminiar + 1 : numeroPanelesPreliminiar;
  
  // System capacity
  const sistemaBaseKW = numeroPanelesFinal * 0.001 * 550;
  const sistemaAjustado = sistemaBaseKW * 0.944; // 5.6% losses
  
  // Daily and monthly production
  const produccionDiaria = sistemaAjustado * 4.385;
  const produccionMensual = produccionDiaria * 30;
  
  return {
    consumoDesignadoFinal,
    numeroPanelesFinal,
    sistemaBaseKW,
    sistemaAjustado,
    produccionDiaria,
    produccionMensual,
  };
}

// Get system components and pricing based on number of panels
export function getSystemComponents(panelCount: number): {
  components: Record<string, number | string>;
  pricing: Record<string, number>;
  categories: Record<string, string[]>;
  retailPrice: number;
  cashPrice: number;
} {
  // Define panel count ranges
  const panelRanges = [6, 8, 10, 12, 14, 16, 18, 20];
  
  // Find the closest range that accommodates the panel count
  let rangeIndex = 0;
  for (let i = 0; i < panelRanges.length; i++) {
    if (panelCount <= panelRanges[i]) {
      rangeIndex = i;
      break;
    }
  }
  
  const selectedRange = panelRanges[rangeIndex];
  
  // Component quantities based on panel count
  const componentTable: Record<string, number[]> = {
    "Solar Panels - Seraphim 550W": [6, 8, 10, 12, 14, 16, 18, 20],
    "HMS-2000 4T": [1, 2, 2, 3, 3, 4, 4, 5],
    "HMS-1000 2T": [1, 0, 1, 0, 1, 0, 1, 0],
    "Trunk Cable": [1, 2, 3, 3, 4, 4, 5, 5],
    "DTU": [1, 1, 1, 1, 1, 1, 1, 1],
    "Racking": [6, 8, 10, 12, 14, 16, 18, 20],
    "aPower": [1, 1, 1, 1, 1, 1, 1, 1],
    "aGate": [1, 1, 1, 1, 1, 1, 1, 1],
  };
  
  // Pricing table
  const pricingTable: Record<string, number[]> = {
    "Seraphim 550W Panels": [1494, 1992, 2490, 2988, 3486, 3984, 4482, 4980],
    "HMS-2000 4T": [445, 890, 890, 1335, 1335, 1780, 1780, 2225],
    "HMS-1000 2T": [400, 0, 400, 0, 400, 0, 400, 0],
    "Trunk Cable": [135, 270, 405, 405, 540, 540, 675, 675],
    "DTU": [499, 499, 499, 499, 499, 499, 499, 499],
    "Racking": [1050, 1400, 1750, 2100, 2450, 2800, 3150, 3500],
    "aPower": [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
    "aGate": [1999, 1999, 1999, 1999, 1999, 1999, 1999, 1999],
    "Instalacion": [1815, 2420, 3025, 3630, 4235, 4840, 5445, 6050],
    "Material Electrico": [1650, 2200, 2750, 3300, 3850, 4400, 4950, 5500],
    "Permisos": [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
    "Overhead": [612, 829, 291, 243, 205, 157, 619, 1071],
    "SunCom- Adjusted Retail Prices": [21599, 23999, 25999, 27999, 30499, 32499, 35499, 37999],
    "SunCom - Cash Prices": [19999, 20999, 21999, 22999, 24999, 26999, 28999, 31999],
  };
  
  // Categories for grouping components
  const categories: Record<string, string[]> = {
    "Microinverters & Misc": ["HMS-2000 4T", "HMS-1000 2T", "Trunk Cable", "DTU"],
    "Installation": ["Instalacion", "Permisos"],
    "Panels & Racking": ["Seraphim 550W Panels", "Racking"],
    "FranklinWh": ["aGate", "aPower"],
    "Electrical Materials": ["Material Electrico"],
    "Overhead": ["Overhead"],
  };
  
  // Build components object
  const components: Record<string, number | string> = {};
  Object.keys(componentTable).forEach(component => {
    components[component] = componentTable[component][rangeIndex];
  });
  
  // Add installation components
  components["Instalacion"] = "YES";
  components["Material Electrico"] = "YES";
  components["Permisos"] = "YES";
  
  // Build pricing object
  const pricing: Record<string, number> = {};
  Object.keys(pricingTable).forEach(item => {
    pricing[item] = pricingTable[item][rangeIndex];
  });
  
  return {
    components,
    pricing,
    categories,
    retailPrice: pricing["SunCom- Adjusted Retail Prices"],
    cashPrice: pricing["SunCom - Cash Prices"]
  };
}

// Calculate financial projection over system lifetime
export function calculateFinancialProjection(
  consumoDesignadoFinal: number,
  produccionMensualEstimada: number,
  monthlyPayment: number,
  years: number = 25
): {
  coveragePercent: number;
  yearOneSavings: number;
  lifetimeSavings: number;
  paybackPeriod: number;
  yearlySavings: number[];
  cumulativeSavings: number[];
} {
  const tarifaInicial = 0.2549; // Initial LUMA rate
  const inflacionAnual = 0.035; // Annual inflation rate
  
  // Calculate coverage percentage
  const coveragePercent = (produccionMensualEstimada / consumoDesignadoFinal) * 100;
  
  // Calculate yearly savings
  const yearlySavings: number[] = [];
  let cumulativeSavings: number[] = [];
  let lifetimeSavings = 0;
  let paybackYear = 0;
  
  for (let year = 1; year <= years; year++) {
    const tarifaAjustada = tarifaInicial * Math.pow(1 + inflacionAnual, year - 1);
    const costeLumaAnual = consumoDesignadoFinal * 12 * tarifaAjustada;
    const pagoSolarAnual = monthlyPayment * 12;
    
    const ahorroAnual = costeLumaAnual - pagoSolarAnual;
    yearlySavings.push(ahorroAnual);
    
    lifetimeSavings += ahorroAnual;
    
    // Calculate cumulative savings
    if (year === 1) {
      cumulativeSavings.push(ahorroAnual);
    } else {
      cumulativeSavings.push(cumulativeSavings[year - 2] + ahorroAnual);
    }
    
    // Determine payback period (if not yet found)
    if (paybackYear === 0 && cumulativeSavings[year - 1] >= monthlyPayment * 12 * years) {
      paybackYear = year;
    }
  }
  
  // If payback period wasn't found within the timeframe, set to max years
  if (paybackYear === 0) {
    paybackYear = years;
  }
  
  return {
    coveragePercent,
    yearOneSavings: yearlySavings[0],
    lifetimeSavings,
    paybackPeriod: paybackYear,
    yearlySavings,
    cumulativeSavings,
  };
}