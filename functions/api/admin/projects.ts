import { authorizeAdmin } from '../../_lib/auth';
import { PagesContext, MAX_UPLOAD_BYTES, MEDIA_PREFIX, PROJECT_PREFIX, json, listProjects, message, requireSameOrigin } from '../../_lib/types';

const extensions: Record<string, { extension: string; type: 'image' | 'video' }> = {
  'image/jpeg': { extension: 'jpg', type: 'image' },
  'image/png': { extension: 'png', type: 'image' },
  'image/webp': { extension: 'webp', type: 'image' },
  'video/mp4': { extension: 'mp4', type: 'video' },
  'video/webm': { extension: 'webm', type: 'video' },
};

function textField(form: FormData, name: string, max: number): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  const projects = await listProjects(context.env.PORTFOLIO_BUCKET);
  return json(projects);
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
    return message('Choose a media file and complete the project details.', 400);
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return message('Choose an image or video file.', 400);
  if (file.size > MAX_UPLOAD_BYTES) return message('Files must be 50 MB or smaller.', 413);
  const mediaType = extensions[file.type];
  if (!mediaType) return message('Use JPEG, PNG, WebP, MP4, or WebM files.', 415);

  const title = textField(form, 'title', 120);
  const category = textField(form, 'category', 60);
  const categoryLabel = textField(form, 'categoryLabel', 60) || category;
  const alt = textField(form, 'alt', 500);
  const brief = textField(form, 'brief', 1000);
  const yearInput = textField(form, 'year', 4);
  if (!title || !category || !alt) return message('Title, category, and descriptive alt text are required.', 400);
  const year = /^\d{4}$/.test(yearInput) ? yearInput : String(new Date().getUTCFullYear());
  const id = crypto.randomUUID();
  const objectKey = `${MEDIA_PREFIX}${id}.${mediaType.extension}`;
  const project = {
    id,
    title,
    category,
    categoryLabel,
    type: mediaType.type,
    year,
    brief,
    alt,
    src: `/api/media/${id}`,
    objectKey,
    contentType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
    featured: form.get('featured') === 'true',
  };

  await context.env.PORTFOLIO_BUCKET.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { title, alt },
  });
  try {
    await context.env.PORTFOLIO_BUCKET.put(`${PROJECT_PREFIX}${id}.json`, JSON.stringify(project), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    });
  } catch {
    await context.env.PORTFOLIO_BUCKET.delete(objectKey);
    return message('The project record could not be saved. The uploaded file was rolled back.', 500);
  }
  return json(project, 201);
};
