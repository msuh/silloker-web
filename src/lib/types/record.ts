import type { RecordType } from './search';

export interface RecordEntity {
  id: number;
  title: string;
  recordType: RecordType;
  year: number;
  month: number;
  day: number;
  bookName: string;
  bookVolume: string;
  bookNumber: number;
  content: string;
  originalSourceReference: string;
  additionalInformation: string;
  edited: boolean;
}
