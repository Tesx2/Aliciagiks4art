export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  type: 'image' | 'video';
  year: string;
  brief: string;
  alt: string;
  src: string;
  objectKey: string;
  contentType: string;
  size: number;
  createdAt: string;
  featured: boolean;
}

export interface R2ObjectBody {
  body: ReadableStream<Uint8Array>;
  httpMetadata?: { contentType?: string; cacheControl?: string };
  size: number;
  etag: string;
}

export interface R2Bucket {
  get(key: string, options?: { range?: { offset: number; length: number } }): Promise<R2ObjectBody | null>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: {
    httpMetadata?: { contentType?: string; cacheControl?: string };
    customMetadata?: Record<string, string>;
  }): Promise<unknown>;
  delete(key: string | string[]): Promise<void>;
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    objects: Array<{ key: string }>;
    truncated: boolean;
    cursor?: string;
  }>;
}

export interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
}

export interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const PROJECT_PREFIX = 'projects/';
export const MEDIA_PREFIX = 'media/';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function message(text: string, status: number): Response {
  return json({ error: text }, status);
}

export function requireSameOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return message('Request origin is not allowed.', 403);
  return null;
}

export function safeId(value: string | string[] | undefined): string | null {
  const id = Array.isArray(value) ? value[0] : value;
  return id && /^[a-f0-9-]{36}$/i.test(id) ? id : null;
}

export async function listProjects(bucket: R2Bucket): Promise<PortfolioProject[]> {
  const projects: PortfolioProject[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: PROJECT_PREFIX, limit: 1000, cursor });
    const records = await Promise.all(page.objects.map(async ({ key }) => {
      const object = await bucket.get(key);
      if (!object) return null;
      try {
        return JSON.parse(await new Response(object.body).text()) as PortfolioProject;
      } catch {
        return null;
      }
    }));
    records.forEach((record) => { if (record) projects.push(record); });
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
