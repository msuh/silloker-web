const DEFAULT_API_BASE_URL = 'http://3.140.156.59:8080';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const errorMessage = (status: number, details: unknown): string => {
  if (details && typeof details === 'object') {
    const body = details as { error?: unknown; message?: unknown };
    const parts = [body.error, body.message].filter((value): value is string => typeof value === 'string');
    if (parts.length > 0) {
      return parts.join(': ');
    }
  }
  return `Request failed with status ${status}`;
};

const parseErrorBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  try {
    return contentType.includes('application/json') ? await response.json() : await response.text();
  } catch {
    return undefined;
  }
};

export const request = async (path: string, init?: RequestInit): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const details = await parseErrorBody(response);
    throw new ApiError(errorMessage(response.status, details), response.status, details);
  }
  return response;
};

export const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await request(path, init);
  return (await response.json()) as T;
};

export const jsonRequest = (method: 'POST' | 'PUT' | 'PATCH', body: unknown): RequestInit => ({
  method,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});
