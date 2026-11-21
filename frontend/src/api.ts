const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface Movie {
  _id: string;
  title: string;
  director: string;
  year: number;
  genres: string[];
}

export interface MoviePage {
  items: Movie[];
  total: number;
  page: number;
  pages: number;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : (data?.message ?? 'Request failed');
    throw new ApiError(res.status, message);
  }

  return data as T;
}