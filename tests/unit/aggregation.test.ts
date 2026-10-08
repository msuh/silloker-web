import { describe, expect, it } from 'vitest';

import { combineAggregationRatio, seriesRows } from '../../src/utils/aggregation';

describe('aggregation transforms', () => {
  it('combines keyword counts and divides by selected archive totals', () => {
    const ratios = combineAggregationRatio(
      [
        { label: 'a', values: [{ year: 1600, count: 3 }] },
        { label: 'b', values: [{ year: 1600, count: 2 }] },
      ],
      [
        { label: 'Wangjo', values: [{ year: 1600, count: 20 }] },
        { label: 'Secretariat', values: [{ year: 1600, count: 5 }] },
      ],
      1600,
      1600,
    );

    expect(ratios).toEqual([{ year: 1600, count: 0.2 }]);
  });

  it('preserves legacy zero-denominator edge cases', () => {
    const noHits = combineAggregationRatio([], [], 1600, 1600);
    const hitsWithoutRecords = combineAggregationRatio(
      [{ label: 'a', values: [{ year: 1600, count: 1 }] }],
      [],
      1600,
      1600,
    );

    expect(Number.isNaN(noHits[0]?.count)).toBe(true);
    expect(hitsWithoutRecords[0]?.count).toBe(Infinity);
  });

  it('fills missing years with zero for chart and table rendering', () => {
    expect(
      seriesRows([{ label: 'term', values: [{ year: 1601, count: 4 }] }], 1600, 1602),
    ).toEqual([
      { year: 1600, term: 0 },
      { year: 1601, term: 4 },
      { year: 1602, term: 0 },
    ]);
  });
});
