import { authorizeAdmin } from '../../_lib/auth';
import { getSiteContent, normalizeSiteContent, SITE_CONTENT_KEY } from '../../_lib/site';
import { PagesContext, json, message, requireSameOrigin } from '../../_lib/types';

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  return json(await getSiteContent(context.env.PORTFOLIO_BUCKET));
};

export const onRequestPut = async (context: PagesContext): Promise<Response> => {
  const wrongOrigin = requireSameOrigin(context.request);
  if (wrongOrigin) return wrongOrigin;
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  let body: unknown;
  try {
    const raw = await context.request.text();
    if (raw.length > 48_000) return message('Site content is too large to save.', 413);
    body = JSON.parse(raw);
  } catch {
    return message('Site content is not valid JSON.', 400);
  }
  const content = normalizeSiteContent(body);
  await context.env.PORTFOLIO_BUCKET.put(SITE_CONTENT_KEY, JSON.stringify(content), {
    httpMetadata: { contentType: 'application/json; charset=utf-8', cacheControl: 'no-store' },
  });
  return json({ saved: true, content });
};
