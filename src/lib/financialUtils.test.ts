import { getLUMARate, calculateMonthlyBill, calculateYearlyBills, calculateMonthlySavings } from './financialUtils';

describe('Financial Utilities', () => {
  describe('getLUMARate', () => {
    it('should return correct rate for April 2025', () => {
      const date = new Date('2025-04-15');
      expect(getLUMARate(date)).toBe(0.26038);
    });

    it('should return correct rate for March 2050', () => {
      const date = new Date('2050-03-15');
      expect(getLUMARate(date)).toBe(0.47757);
    });

    it('should return last known rate for future dates', () => {
      const date = new Date('2051-01-15');
      expect(getLUMARate(date)).toBe(0.47757);
    });
  });

  describe('calculateMonthlyBill', () => {
    it('should calculate correct bill for 800kWh in April 2025', () => {
      const date = new Date('2025-04-15');
      const consumption = 800;
      const expectedBill = 800 * 0.26038;
      expect(calculateMonthlyBill(consumption, date)).toBe(expectedBill);
    });
  });

  describe('calculateYearlyBills', () => {
    it('should calculate bills for one year starting April 2025', () => {
      const monthlyConsumption = 800;
      const startDate = new Date('2025-04-15');
      const { yearlyBills, totalBill } = calculateYearlyBills(monthlyConsumption, startDate, 1);

      expect(yearlyBills.length).toBe(1);
      expect(yearlyBills[0]).toBeGreaterThan(0);
      expect(totalBill).toBe(yearlyBills[0]);
    });

    it('should calculate bills for 25 years with increasing rates', () => {
      const monthlyConsumption = 800;
      const startDate = new Date('2025-04-15');
      const { yearlyBills, totalBill } = calculateYearlyBills(monthlyConsumption, startDate, 25);

      expect(yearlyBills.length).toBe(25);
      // Each year should have a higher bill than the previous due to rate increases
      for (let i = 1; i < yearlyBills.length; i++) {
        expect(yearlyBills[i]).toBeGreaterThan(yearlyBills[i - 1]);
      }
      // Total should be sum of all yearly bills
      expect(totalBill).toBe(yearlyBills.reduce((sum, bill) => sum + bill, 0));
    });

    it('should handle zero consumption', () => {
      const monthlyConsumption = 0;
      const startDate = new Date('2025-04-15');
      const { yearlyBills, totalBill } = calculateYearlyBills(monthlyConsumption, startDate, 1);

      expect(yearlyBills[0]).toBe(0);
      expect(totalBill).toBe(0);
    });
  });

  describe('calculateMonthlySavings', () => {
    it('should calculate correct savings with full offset', () => {
      const date = new Date('2025-04-15');
      const originalConsumption = 800;
      const remainingConsumption = 0; // Full offset with solar
      const rate = 0.26038;
      const expectedSavings = originalConsumption * rate;

      expect(calculateMonthlySavings(originalConsumption, remainingConsumption, date))
        .toBe(expectedSavings);
    });

    it('should calculate correct savings with partial offset', () => {
      const date = new Date('2025-04-15');
      const originalConsumption = 800;
      const remainingConsumption = 200; // 75% offset
      const rate = 0.26038;
      const expectedSavings = (originalConsumption - remainingConsumption) * rate;

      expect(calculateMonthlySavings(originalConsumption, remainingConsumption, date))
        .toBe(expectedSavings);
    });

    it('should handle edge case with no savings', () => {
      const date = new Date('2025-04-15');
      const originalConsumption = 800;
      const remainingConsumption = 800; // No offset
      
      expect(calculateMonthlySavings(originalConsumption, remainingConsumption, date))
        .toBe(0);
    });

    it('should handle different rates across months', () => {
      const april2025 = new Date('2025-04-15');
      const may2025 = new Date('2025-05-15');
      const consumption = 800;
      const remaining = 0;

      const aprilSavings = calculateMonthlySavings(consumption, remaining, april2025);
      const maySavings = calculateMonthlySavings(consumption, remaining, may2025);

      expect(aprilSavings).toBe(consumption * 0.26038);
      expect(maySavings).toBe(consumption * 0.25490);
      expect(aprilSavings).toBeGreaterThan(maySavings);
    });
  });
});
