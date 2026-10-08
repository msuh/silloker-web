import { describe, expect, it } from 'vitest';

import type { AggregationCriteria } from '../../src/types/aggregation';
import type { SearchCriteria } from '../../src/types/records';
import { validateAggregationCriteria, validateSearchCriteria } from '../../src/utils/validation';

const validSearch = (): SearchCriteria => ({
  keywords: ['鳥銃'],
  recordTypes: ['WANGJO'],
});

describe('search validation', () => {
  it('requires a keyword and a record source', () => {
    expect(validateSearchCriteria({ ...validSearch(), keywords: [] })).toBe(
      'Provide at least one keyword',
    );
    expect(validateSearchCriteria({ ...validSearch(), recordTypes: [] })).toBe(
      'Select at least one record type',
    );
  });

  it('accepts five keywords and rejects more than five', () => {
    expect(
      validateSearchCriteria({ ...validSearch(), keywords: ['1', '2', '3', '4', '5'] }),
    ).toBeNull();
    expect(
      validateSearchCriteria({ ...validSearch(), keywords: ['1', '2', '3', '4', '5', '6'] }),
    ).toBe('Provide no more than 5 keywords');
  });

  it('validates the inclusive dynasty range when both bounds are present', () => {
    expect(
      validateSearchCriteria({ ...validSearch(), yearStart: 1600, yearEnd: 1500 }),
    ).toMatch(/start/);
    expect(
      validateSearchCriteria({ ...validSearch(), yearStart: 1300, yearEnd: 1500 }),
    ).toMatch(/1392/);
    expect(
      validateSearchCriteria({ ...validSearch(), yearStart: 1392, yearEnd: 1910 }),
    ).toBeNull();
  });
});

describe('aggregation validation', () => {
  const validAggregation: AggregationCriteria = {
    keywords: ['火藥'],
    recordTypes: ['WANGJO'],
  };

  it('allows ten keywords and rejects eleven', () => {
    expect(
      validateAggregationCriteria({
        ...validAggregation,
        keywords: Array.from({ length: 10 }, (_, index) => String(index)),
      }),
    ).toBeNull();
    expect(
      validateAggregationCriteria({
        ...validAggregation,
        keywords: Array.from({ length: 11 }, (_, index) => String(index)),
      }),
    ).toBe('Provide no more than 10 keywords');
  });

  it('requires exactly one keyword for downloads', () => {
    expect(
      validateAggregationCriteria(
        { ...validAggregation, keywords: ['火藥', '鳥銃'] },
        false,
        true,
      ),
    ).toBe('Provide exactly one keyword for download');
  });
});
