import { betterAuth } from 'better-auth';
import { Env, PagesContext, message } from './types';

export function createAuth(env: Env, allowInitialSetup = false) {
  const baseURL = env.BETTER_AUTH_URL;
  if (!env.AUTH_DB || !env.BETTER_AUTH_SECRET || !baseURL) {
    throw new Error('Better Auth requires AUTH_DB, BETTER_AUTH_SECRET, and BETTER_AUTH_URL.');
  }

  return betterAuth({
    // Cloudflare D1 is provided as a native binding. The type assertion bridges
    // the local Pages context type to Better Auth's D1 adapter typing.
    database: env.AUTH_DB as never,
    secret: env.BETTER_AUTH_SECRET,
    baseURL,
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowInitialSetup,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60, updateAge: 60 * 60 },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
      storage: 'database',
      customRules: {
        '/sign-in/email': { window: 300, max: 5 },
      },
    },
    advanced: {
      useSecureCookies: baseURL.startsWith('https://'),
      defaultCookieAttributes: { httpOnly: true, sameSite: 'strict', secure: baseURL.startsWith('https://') },
    },
  });
}

export async function authorizeAdmin(context: PagesContext): Promise<Response | null> {
  const { env, request } = context;
  const allowedEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!allowedEmail || !env.AUTH_DB || !env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL) {
    return message('Admin authentication is not configured yet.', 503);
  }

  try {
    const auth = createAuth(env);
    const result = await auth.api.getSession({ headers: request.headers });
    if (!result?.user) return message('Sign in to manage this portfolio.', 401);
    if (result.user.email.toLowerCase() !== allowedEmail) {
      return message('This account is not allowed to manage the portfolio.', 403);
    }
    return null;
  } catch {
    return message('Admin authentication could not be verified.', 401);
  }
}
