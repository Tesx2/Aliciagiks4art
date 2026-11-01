import { authorizeAdmin } from '../../_lib/auth';
import { PagesContext, json, message, requireSameOrigin } from '../../_lib/types';
import { SITE_MEDIA_PREFIX } from '../../_lib/site';

const imageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const maxImageBytes = 20 * 1024 * 1024;

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  const page = await context.env.PORTFOLIO_BUCKET.list({ prefix: SITE_MEDIA_PREFIX, limit: 500 });
  const assets = await Promise.all(page.objects.filter(({ key }) => key.endsWith('.json')).map(async ({ key }) => {
    const object = await context.env.PORTFOLIO_BUCKET.get(key);
    if (!object) return null;
    try {
      const item = JSON.parse(await new Response(object.body).text()) as { id: string; alt: string; createdAt: string };
      return { ...item, src: `/api/media/${item.id}` };
    } catch {
      return null;
    }
  }));
  return json(assets.filter(Boolean));
};

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const wrongOrigin = requireSameOrigin(context.request);
  if (wrongOrigin) return wrongOrigin;
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  let form: FormData;
  try {
    form = await context.request.formData();
  } catch {
    return message('Choose an image file to upload.', 400);
  }
  const file = form.get('file');
  const altValue = form.get('alt');
  const alt = typeof altValue === 'string' ? altValue.trim().slice(0, 500) : '';
  if (!(file instanceof File) || file.size === 0) return message('Choose an image file.', 400);
  if (file.size > maxImageBytes) return message('Images must be 20 MB or smaller.', 413);
  const extension = imageTypes[file.type];
  if (!extension) return message('Use a JPEG, PNG, or WebP image.', 415);
  if (!alt) return message('Add descriptive alt text before uploading.', 400);

  const id = crypto.randomUUID();
  const objectKey = `${SITE_MEDIA_PREFIX}${id}.${extension}`;
  const metadata = { id, alt, objectKey, contentType: file.type, size: file.size, createdAt: new Date().toISOString() };
  await context.env.PORTFOLIO_BUCKET.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  });
  try {
    await context.env.PORTFOLIO_BUCKET.put(`${SITE_MEDIA_PREFIX}${id}.json`, JSON.stringify(metadata), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    });
  } catch {
    await context.env.PORTFOLIO_BUCKET.delete(objectKey);
    return message('The image record could not be saved. The upload was rolled back.', 500);
  }
  return json({ ...metadata, src: `/api/media/${id}` }, 201);
};
