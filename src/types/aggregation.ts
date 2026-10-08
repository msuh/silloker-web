import type { RecordType } from './records';

export interface KeywordAggregation {
  year: number;
  count: number;
}

export interface AggregationRequest {
  recordType: RecordType[];
  content: string[];
}

export interface AggregationSeries {
  label: string;
  values: KeywordAggregation[];
}

export interface AggregationResult {
  keywordSeries: AggregationSeries[];
  ratioSeries: AggregationSeries[];
  recordCountSeries: AggregationSeries[];
}

export interface AggregationCriteria {
  keywords: string[];
  recordTypes: RecordType[];
}
