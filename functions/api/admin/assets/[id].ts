import { authorizeAdmin } from '../../../_lib/auth';
import { PagesContext, message, safeId, requireSameOrigin } from '../../../_lib/types';
import { SITE_MEDIA_PREFIX } from '../../../_lib/site';

export const onRequestDelete = async (context: PagesContext): Promise<Response> => {
  const wrongOrigin = requireSameOrigin(context.request);
  if (wrongOrigin) return wrongOrigin;
  const denied = await authorizeAdmin(context);
  if (denied) return denied;
  const id = safeId(context.params.id);
  if (!id) return message('Image not found.', 404);
  const metadataKey = `${SITE_MEDIA_PREFIX}${id}.json`;
  const object = await context.env.PORTFOLIO_BUCKET.get(metadataKey);
  if (!object) return message('Image not found.', 404);
  let asset: { objectKey?: string };
  try {
    asset = JSON.parse(await new Response(object.body).text()) as { objectKey?: string };
  } catch {
    return message('Image metadata is invalid.', 500);
  }
  if (!asset.objectKey?.startsWith(SITE_MEDIA_PREFIX) || asset.objectKey.includes('..')) return message('Image metadata is invalid.', 500);
  await context.env.PORTFOLIO_BUCKET.delete([metadataKey, asset.objectKey]);
  return new Response(null, { status: 204 });
};
