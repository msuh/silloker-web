import type { AggregationSeries, KeywordAggregation } from '../types/aggregation';
import type { RecordType } from '../types/records';
import { RECORD_TYPE_OPTIONS } from '../types/records';

export const YEAR_START = 1392;
export const RATIO_YEAR_END = 1910;
export const CHART_YEAR_END = 1928;

const valuesByYear = (values: KeywordAggregation[]): Map<number, number> =>
  new Map(values.map(({ year, count }) => [year, count]));

export const combineAggregationRatio = (
  keywordSeries: AggregationSeries[],
  recordCountSeries: AggregationSeries[],
  startYear = YEAR_START,
  endYear = RATIO_YEAR_END,
): KeywordAggregation[] => {
  const keywordMaps = keywordSeries.map((series) => valuesByYear(series.values));
  const countMaps = recordCountSeries.map((series) => valuesByYear(series.values));
  const ratios: KeywordAggregation[] = [];

  for (let year = startYear; year <= endYear; year += 1) {
    const keywordCount = keywordMaps.reduce((sum, values) => sum + (values.get(year) ?? 0), 0);
    const recordCount = countMaps.reduce((sum, values) => sum + (values.get(year) ?? 0), 0);
    ratios.push({ year, count: keywordCount / recordCount });
  }

  return ratios;
};

export const recordTypeLabel = (recordType: RecordType): string =>
  RECORD_TYPE_OPTIONS.find((option) => option.value === recordType)?.shortLabel ?? recordType;

export const seriesRows = (
  series: AggregationSeries[],
  startYear = YEAR_START,
  endYear = CHART_YEAR_END,
): Array<Record<string, number>> => {
  const maps = series.map((item) => valuesByYear(item.values));
  const rows: Array<Record<string, number>> = [];

  for (let year = startYear; year <= endYear; year += 1) {
    const row: Record<string, number> = { year };
    series.forEach((item, index) => {
      row[item.label] = maps[index]?.get(year) ?? 0;
    });
    rows.push(row);
  }
  return rows;
};

export const totalForSeries = (series: AggregationSeries): number =>
  series.values.reduce((total, point) => total + point.count, 0);
