import type { RecordEntity } from './record';

export enum RecordType {
  GARRISON = "GARRISON",
  PIBYUN = "PIBYUN",
  SECRETARIAT = "SECRETARIAT",
  WANGJO = "WANGJO"
}

export interface SearchableRecord {
  keywords: string[];
  id?: string;
  title?: string[];
  recordType?: RecordType[];
  year1?: number;
  year2?: number;
  month?: number;
  day?: number;
  bookName?: string;
  bookVolume?: string;
  bookNumber?: number;
  content?: string[];
}

export function recordTypeToKorean(type: RecordType): string {
  if (type == RecordType.WANGJO) return '왕조실록';
  else if (type == RecordType.GARRISON) return '군영등록';
  else if (type == RecordType.SECRETARIAT) return '승정원일기';
  else if (type == RecordType.PIBYUN) return '비변사등록';
  else return '';
}

export function fromURLParams(params: URLSearchParams): SearchableRecord {
  const keywords: Array<string> = params.get('keyword') != null
    ? params.get('keyword')!.split(',')
    : [];

  const recordTypes: Array<RecordType> = params.get('recordType') != null
    ? params.get('recordType')!.split(',').map(x => x as RecordType)
    : [];

  return {
    keywords: keywords,
    recordType: recordTypes,
  };
}

export function toURLParams(record: SearchableRecord) {
  return `/search?keyword=${record.keywords}&recordType=${record.recordType}`;
}

export interface SearchResult {
  totalCount: number;
  entities: RecordEntity[];
}
