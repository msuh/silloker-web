import type { AggregationCriteria } from '../types/aggregation';
import type { SearchCriteria } from '../types/records';

export const validateKeywords = (keywords: string[], maximum: number): string | null => {
  if (keywords.length === 0) return 'Provide at least one keyword';
  if (keywords.some((keyword) => keyword.length === 0)) return 'Keyword is not valid';
  if (keywords.length > maximum) {
    return maximum === 5 ? 'Provide no more than 5 keywords' : 'Provide no more than 10 keywords';
  }
  return null;
};

export const validateSearchCriteria = (
  criteria: SearchCriteria,
  isFetching = false,
): string | null => {
  if (isFetching) return 'Please wait for the current request to finish';

  // Preserve the legacy contract: range checks apply when both bounds are supplied.
  if (criteria.yearStart && criteria.yearEnd) {
    if (criteria.yearStart > criteria.yearEnd) return 'Year start must be less than or equal to year end';
    if (criteria.yearStart < 1392 || criteria.yearEnd > 1910) {
      return 'Year range must be between 1392 and 1910';
    }
  }

  const keywordError = validateKeywords(criteria.keywords, 5);
  if (keywordError) return keywordError;
  if (criteria.recordTypes.length === 0) return 'Select at least one record type';
  return null;
};

export const validateAggregationCriteria = (
  criteria: AggregationCriteria,
  isFetching = false,
  forDownload = false,
): string | null => {
  if (isFetching) return 'Please wait for the current request to finish';
  const keywordError = validateKeywords(criteria.keywords, 10);
  if (keywordError) return keywordError;
  if (criteria.recordTypes.length === 0) return 'Select at least one record type';
  if (forDownload && criteria.keywords.length !== 1) {
    return 'Provide exactly one keyword for download';
  }
  return null;
};
