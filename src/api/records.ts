import { requestJson } from './client';
import type { RecordEntity } from '../types/records';

export const getRecord = (id: string | number): Promise<RecordEntity> =>
  requestJson<RecordEntity>(`/record/id/${encodeURIComponent(String(id))}`);
