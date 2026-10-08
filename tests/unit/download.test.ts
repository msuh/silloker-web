import { describe, expect, it } from 'vitest';

import { filenameFromContentDisposition } from '../../src/utils/download';

describe('download filenames', () => {
  it('uses an ordinary content-disposition filename', () => {
    expect(
      filenameFromContentDisposition('attachment; filename="silloker-results.tsv"', 'fallback.tsv'),
    ).toBe('silloker-results.tsv');
  });

  it('decodes an RFC 5987 filename', () => {
    expect(
      filenameFromContentDisposition(
        "attachment; filename*=UTF-8''aggregation%20results.tsv",
        'fallback.tsv',
      ),
    ).toBe('aggregation results.tsv');
  });

  it('falls back when the server provides no filename', () => {
    expect(filenameFromContentDisposition(null, 'search-results.tsv')).toBe(
      'search-results.tsv',
    );
  });
});
