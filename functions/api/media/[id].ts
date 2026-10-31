import { PagesContext, message, safeId, PROJECT_PREFIX } from '../../_lib/types';

export const onRequestGet = async ({ request, env, params }: PagesContext): Promise<Response> => {
  const id = safeId(params.id);
  if (!id) return message('Media not found.', 404);
  const metadata = await env.PORTFOLIO_BUCKET.get(`${PROJECT_PREFIX}${id}.json`);
  if (!metadata) return message('Media not found.', 404);
  let project;
  try {
    project = JSON.parse(await new Response(metadata.body).text()) as { objectKey: string; contentType: string; size: number };
  } catch {
    return message('Media metadata is invalid.', 500);
  }
  if (!project.objectKey?.startsWith('media/') || !project.contentType || !project.size) return message('Media metadata is invalid.', 500);

  const rangeHeader = request.headers.get('range');
  let range: { offset: number; length: number } | undefined;
  let contentRange: string | undefined;
  if (rangeHeader) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(rangeHeader);
    if (!match) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${project.size}` } });
    const start = Number(match[1]);
    const end = match[2] ? Math.min(Number(match[2]), project.size - 1) : project.size - 1;
    if (start >= project.size || end < start) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${project.size}` } });
    range = { offset: start, length: end - start + 1 };
    contentRange = `bytes ${start}-${end}/${project.size}`;
  }

  const object = await env.PORTFOLIO_BUCKET.get(project.objectKey, range ? { range } : undefined);
  if (!object) return message('Media not found.', 404);
  const headers = new Headers({
    'Content-Type': project.contentType,
    'Content-Length': String(range?.length ?? project.size),
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
    'Content-Disposition': 'inline',
    'ETag': object.etag,
  });
  if (contentRange) headers.set('Content-Range', contentRange);
  return new Response(object.body, { status: range ? 206 : 200, headers });
};
