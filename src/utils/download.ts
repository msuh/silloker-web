export const filenameFromContentDisposition = (
  contentDisposition: string | null,
  fallback: string,
): string => {
  if (!contentDisposition) return fallback;

  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1].replace(/^["']|["']$/g, ''));
    } catch {
      return encodedMatch[1].replace(/^["']|["']$/g, '');
    }
  }

  const basicMatch = contentDisposition.match(/filename\s*=\s*("?)([^";]+)\1/i);
  return basicMatch?.[2]?.trim() || fallback;
};

export const saveBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
