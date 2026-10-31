import { authorizeAdmin } from '../../../_lib/auth';
import { PagesContext, PROJECT_PREFIX, json, message, safeId, listProjects, requireSameOrigin } from '../../../_lib/types';

export const onRequestPatch = async (context: PagesContext): Promise<Response> => {
  const wrongOrigin = requireSameOrigin(context.request);
  if (wrongOrigin) return wrongOrigin;
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  const id = safeId(context.params.id);
  if (!id) return message('Project not found.', 404);
  const existing = await context.env.PORTFOLIO_BUCKET.get(`${PROJECT_PREFIX}${id}.json`);
  if (!existing) return message('Project not found.', 404);

  let body: Record<string, unknown>;
  try {
    body = await context.request.json() as Record<string, unknown>;
  } catch {
    return message('Project details are not valid JSON.', 400);
  }
  const project = JSON.parse(await new Response(existing.body).text()) as Record<string, unknown>;
  for (const field of ['title', 'category', 'categoryLabel', 'brief', 'alt', 'year'] as const) {
    if (typeof body[field] === 'string') project[field] = body[field].trim().slice(0, field === 'alt' ? 500 : field === 'brief' ? 1000 : field === 'title' ? 120 : 60);
  }
  if (typeof body.featured === 'boolean') project.featured = body.featured;
  if (!project.title || !project.category || !project.alt) return message('Title, category, and descriptive alt text are required.', 400);
  await context.env.PORTFOLIO_BUCKET.put(`${PROJECT_PREFIX}${id}.json`, JSON.stringify(project), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });
  return json(project);
};

export const onRequestDelete = async (context: PagesContext): Promise<Response> => {
  const wrongOrigin = requireSameOrigin(context.request);
  if (wrongOrigin) return wrongOrigin;
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  const id = safeId(context.params.id);
  if (!id) return message('Project not found.', 404);
  const projects = await listProjects(context.env.PORTFOLIO_BUCKET);
  const project = projects.find((item) => item.id === id);
  if (!project) return message('Project not found.', 404);
  await context.env.PORTFOLIO_BUCKET.delete([project.objectKey, `${PROJECT_PREFIX}${id}.json`]);
  return new Response(null, { status: 204 });
};
