export const RECORD_TYPES = ['WANGJO', 'SECRETARIAT', 'PIBYUN', 'GARRISON'] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export interface RecordTypeOption {
  value: RecordType;
  label: string;
  shortLabel: string;
}

export const RECORD_TYPE_OPTIONS: RecordTypeOption[] = [
  { value: 'WANGJO', label: 'Veritable Records 왕조실록', shortLabel: 'Veritable Records' },
  { value: 'SECRETARIAT', label: 'Royal Secretariat 승정원일기', shortLabel: 'Secretariat' },
  { value: 'PIBYUN', label: 'Border Defense Council 비변사등록', shortLabel: 'Border Defense Council' },
  { value: 'GARRISON', label: 'Garrison Records 군영등록', shortLabel: 'Garrison Records' },
];

export interface SearchCriteria {
  keywords: string[];
  recordTypes: RecordType[];
  yearStart?: number;
  yearEnd?: number;
}

export interface SearchableRecord {
  id?: number;
  title?: string[];
  recordType?: RecordType[];
  year1?: number;
  year2?: number;
  month?: number;
  day?: number;
  bookName?: string;
  bookVolume?: string;
  bookNumber?: string;
  content?: string[];
}

export interface RecordEntity {
  id?: number;
  title?: string;
  recordType: string;
  year?: number;
  month?: number;
  day?: number;
  bookName?: string;
  bookVolume?: string;
  bookNumber?: string;
  content?: string;
  originalSourceReference?: string;
  additionalInformation?: string;
  edited: boolean;
}

export interface SearchResult {
  totalCount: number;
  entities: RecordEntity[];
}

export interface TagEntity {
  id?: number;
  recordId?: number;
  recordType: string;
  tagName: string;
  tagContent: string;
}
