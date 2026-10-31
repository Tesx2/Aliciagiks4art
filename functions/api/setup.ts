import { createAuth } from '../_lib/auth';
import { PagesContext, json, message, requireSameOrigin } from '../_lib/types';

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  if (!env.AUTH_DB || !env.ADMIN_EMAIL || !env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL) {
    return json({ available: false, configured: false });
  }
  try {
    const state = await env.AUTH_DB.prepare('SELECT setup_complete FROM admin_setup WHERE id = 1').first<{ setup_complete: number }>();
    const user = await env.AUTH_DB.prepare('SELECT id FROM user LIMIT 1').first<{ id: string }>();
    return json({ available: Boolean(env.SETUP_SECRET) && !state?.setup_complete && !user, configured: true });
  } catch {
    return message('The admin database is not initialized yet.', 503);
  }
};

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  const wrongOrigin = requireSameOrigin(request);
  if (wrongOrigin) return wrongOrigin;
  if (!env.AUTH_DB || !env.ADMIN_EMAIL || !env.SETUP_SECRET) return message('Initial admin setup is not configured.', 503);
  if (request.headers.get('x-setup-token') !== env.SETUP_SECRET) return message('The setup code is not valid.', 403);

  let body: { email?: unknown; password?: unknown };
  try { body = await request.json() as typeof body; } catch { return message('Enter the admin email and password.', 400); }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (email !== env.ADMIN_EMAIL.trim().toLowerCase()) return message('Use the admin email configured for this site.', 400);
  if (password.length < 12 || password.length > 128) return message('Choose a password between 12 and 128 characters.', 400);

  try {
    const state = await env.AUTH_DB.prepare('SELECT setup_complete FROM admin_setup WHERE id = 1').first<{ setup_complete: number }>();
    const existingUser = await env.AUTH_DB.prepare('SELECT id FROM user LIMIT 1').first<{ id: string }>();
    if (!state || state.setup_complete || existingUser) return message('Initial setup has already been used.', 409);

    // Claim setup atomically so two requests cannot create competing admin accounts.
    const claim = await env.AUTH_DB.prepare('UPDATE admin_setup SET setup_complete = 1 WHERE id = 1 AND setup_complete = 0').run();
    if (claim.meta?.changes !== 1) return message('Initial setup has already been used.', 409);

    try {
      const auth = createAuth(env, true);
      await auth.api.signUpEmail({ body: { name: 'Portfolio Admin', email, password } });
      return json({ ok: true });
    } catch {
      await env.AUTH_DB.prepare('UPDATE admin_setup SET setup_complete = 0 WHERE id = 1').run();
      return message('The admin account could not be created. Check the D1 schema and try again.', 500);
    }
  } catch {
    return message('The admin database is not initialized yet.', 503);
  }
};
