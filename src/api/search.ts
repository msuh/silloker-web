import { jsonRequest, request, requestJson } from './client';
import type { SearchCriteria, SearchResult, SearchableRecord } from '../types/records';
import { RECORD_TYPES } from '../types/records';

export const buildSearchPayload = (criteria: SearchCriteria): SearchableRecord => {
  const payload: SearchableRecord = { content: [...criteria.keywords] };
  if (criteria.yearStart !== undefined) payload.year1 = criteria.yearStart;
  if (criteria.yearEnd !== undefined) payload.year2 = criteria.yearEnd;
  if (criteria.recordTypes.length !== RECORD_TYPES.length) {
    payload.recordType = [...criteria.recordTypes];
  }
  return payload;
};

export const buildSearchDownloadPayload = (criteria: SearchCriteria): SearchableRecord => {
  const payload: SearchableRecord = { content: [...criteria.keywords] };
  if (criteria.yearStart !== undefined) payload.year1 = criteria.yearStart;
  if (criteria.yearEnd !== undefined) payload.year2 = criteria.yearEnd;
  return payload;
};

export const searchRecords = (
  criteria: SearchCriteria,
  pageIndex: number,
  pageSize = 50,
): Promise<SearchResult> =>
  requestJson<SearchResult>(
    `/record/search?page=${pageIndex}&size=${pageSize}`,
    jsonRequest('POST', buildSearchPayload(criteria)),
  );

export const downloadSearchResults = async (
  criteria: SearchCriteria,
): Promise<{ blob: Blob; headers: Headers }> => {
  const response = await request(
    '/record/download/search',
    jsonRequest('POST', buildSearchDownloadPayload(criteria)),
  );
  return { blob: await response.blob(), headers: response.headers };
};
