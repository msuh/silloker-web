import { jsonRequest, request, requestJson } from './client';
import type { AggregationCriteria, AggregationRequest, KeywordAggregation } from '../types/aggregation';
import type { RecordType } from '../types/records';

export const buildAggregationRequest = (
  keyword: string,
  recordTypes: RecordType[],
): AggregationRequest => ({
  recordType: [...recordTypes],
  content: [keyword],
});

export const getKeywordAggregation = (
  keyword: string,
  recordTypes: RecordType[],
): Promise<KeywordAggregation[]> =>
  requestJson<KeywordAggregation[]>(
    '/record/aggregation',
    jsonRequest('POST', buildAggregationRequest(keyword, recordTypes)),
  );

export const getRecordTypeAggregation = (recordType: RecordType): Promise<KeywordAggregation[]> =>
  requestJson<KeywordAggregation[]>(`/record/aggregation/${encodeURIComponent(recordType)}`);

export const downloadAggregation = async (
  criteria: AggregationCriteria,
): Promise<{ blob: Blob; headers: Headers }> => {
  const response = await request(
    '/record/download/aggregation',
    jsonRequest('POST', buildAggregationRequest(criteria.keywords[0] ?? '', criteria.recordTypes)),
  );
  return { blob: await response.blob(), headers: response.headers };
};
