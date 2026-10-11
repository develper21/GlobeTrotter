import { describe, it, expect } from 'vitest';
import { getTripBudget, formatTripBudget } from './tripBudget';

describe('getTripBudget', () => {
  it('returns totalBudget when present', () => {
    expect(getTripBudget({ totalBudget: 50000 })).toBe(50000);
  });

  it('falls back to budgetAmount when totalBudget missing', () => {
    expect(getTripBudget({ budgetAmount: 25000 })).toBe(25000);
  });

  it('returns 0 when neither field is present', () => {
    expect(getTripBudget({})).toBe(0);
  });

  it('returns 0 for null/undefined trip', () => {
    expect(getTripBudget(null)).toBe(0);
    expect(getTripBudget(undefined)).toBe(0);
  });

  it('returns 0 for non-numeric budget values', () => {
    expect(getTripBudget({ totalBudget: 'abc' })).toBe(0);
  });

  it('converts numeric strings', () => {
    expect(getTripBudget({ totalBudget: '1234' })).toBe(1234);
  });

  it('returns 0 for NaN', () => {
    expect(getTripBudget({ totalBudget: NaN })).toBe(0);
  });
});

describe('formatTripBudget', () => {
  it('formats a numeric budget using toLocaleString', () => {
    expect(formatTripBudget({ totalBudget: 50000 })).toBe((50000).toLocaleString());
  });

  it('formats missing budget as 0', () => {
    expect(formatTripBudget({})).toBe((0).toLocaleString());
    expect(formatTripBudget(null)).toBe((0).toLocaleString());
  });
});
