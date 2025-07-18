import { RecordType, type SearchableRecord, type SearchResult } from "$lib/types/search";

export const searchResult: SearchResult = $state({
  totalCount: 0,
  entities: [],
});

export const searchBarState: SearchableRecord = $state({
  keywords: [],
  recordType: [
    RecordType.WANGJO,
    RecordType.SECRETARIAT,
    RecordType.PIBYUN,
    RecordType.GARRISON,
  ],
});
