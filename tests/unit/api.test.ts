import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getKeywordAggregation } from '../../src/api/aggregation';
import { getRecord } from '../../src/api/records';
import {
  buildSearchDownloadPayload,
  buildSearchPayload,
  downloadSearchResults,
  searchRecords,
} from '../../src/api/search';
import { getRecordTags } from '../../src/api/tags';
import type { SearchCriteria } from '../../src/types/records';

const criteria: SearchCriteria = {
  keywords: ['進取京城'],
  recordTypes: ['WANGJO', 'SECRETARIAT'],
  yearStart: 1500,
  yearEnd: 1560,
};

describe('typed API contracts', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('serializes search criteria and record types', () => {
    expect(buildSearchPayload(criteria)).toEqual({
      content: ['進取京城'],
      recordType: ['WANGJO', 'SECRETARIAT'],
      year1: 1500,
      year2: 1560,
    });
  });

  it('omits recordType when all sources are selected', () => {
    expect(
      buildSearchPayload({
        ...criteria,
        recordTypes: ['WANGJO', 'SECRETARIAT', 'PIBYUN', 'GARRISON'],
      }),
    ).toEqual({
      content: ['進取京城'],
      year1: 1500,
      year2: 1560,
    });
  });

  it('preserves the legacy download payload without record types', () => {
    expect(buildSearchDownloadPayload(criteria)).toEqual({
      content: ['進取京城'],
      year1: 1500,
      year2: 1560,
    });
  });

  it('constructs zero-based search pagination', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ totalCount: 0, entities: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    await searchRecords(criteria, 3, 50);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/record/search?page=3&size=50'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('maps record and tag JSON responses through their verified endpoints', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 42, recordType: 'WANGJO', edited: false }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ recordId: 42, recordType: 'WANGJO', tagName: 'Person', tagContent: 'Yi' }]),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      );

    await expect(getRecord(42)).resolves.toMatchObject({ id: 42 });
    await expect(getRecordTags(42)).resolves.toEqual([
      expect.objectContaining({ tagName: 'Person' }),
    ]);
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/record/id/42');
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/tag/record/42');
  });

  it('constructs aggregation and download requests', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ year: 1600, count: 2 }]), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response('data', {
          status: 200,
          headers: { 'content-disposition': 'attachment; filename="records.tsv"' },
        }),
      );

    await getKeywordAggregation('火藥', ['WANGJO']);
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      recordType: ['WANGJO'],
      content: ['火藥'],
    });

    const download = await downloadSearchResults(criteria);
    expect(download.headers.get('content-disposition')).toContain('records.tsv');
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/record/download/search');
  });
});
