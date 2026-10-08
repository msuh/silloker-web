import { requestJson } from './client';
import type { TagEntity } from '../types/records';

export const getRecordTags = (recordId: string | number): Promise<TagEntity[]> =>
  requestJson<TagEntity[]>(`/tag/record/${encodeURIComponent(String(recordId))}`);
