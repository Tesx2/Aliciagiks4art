import { Env, PagesContext, message } from './types';

interface AccessClaims {
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  email?: string;
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function decodePart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

export async function authorizeAdmin(context: PagesContext): Promise<Response | null> {
  const { env, request } = context;
  const issuer = env.ACCESS_TEAM_DOMAIN?.replace(/\/+$/, '');
  const audience = env.ACCESS_AUD;
  const allowedEmails = (env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const cookieToken = request.headers.get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('CF_Authorization='))
    ?.slice('CF_Authorization='.length);
  const token = request.headers.get('cf-access-jwt-assertion') || cookieToken;

  if (!issuer || !audience || allowedEmails.length === 0) {
    return message('Admin authentication is not configured.', 503);
  }
  if (!token) return message('Sign in through Cloudflare Access to manage this portfolio.', 401);

  try {
    if (token.length > 16_384) throw new Error('Token is too large');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed token');
    const [encodedHeader, encodedClaims, encodedSignature] = parts;
    if (!encodedHeader || !encodedClaims || !encodedSignature) throw new Error('Malformed token');
    const header = decodePart<{ alg?: string; kid?: string }>(encodedHeader);
    if (header.alg !== 'RS256' || !header.kid) throw new Error('Unsupported token signature');
    const claims = decodePart<AccessClaims>(encodedClaims);

    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const now = Math.floor(Date.now() / 1000);
    if (claims.iss !== issuer || !audiences.includes(audience) || !claims.exp || claims.exp <= now || (claims.nbf && claims.nbf > now)) {
      throw new Error('Token claims are invalid');
    }

    const certResponse = await fetch(`${issuer}/cdn-cgi/access/certs`, { cache: 'no-cache' });
    if (!certResponse.ok) throw new Error('Unable to fetch Access signing keys');
    const certs = await certResponse.json() as { keys?: Array<JsonWebKey & { kid?: string; alg?: string }> };
    const jwk = certs.keys?.find((key) => key.kid === header.kid && key.alg === 'RS256');
    if (!jwk) throw new Error('Signing key not found');

    const publicKey = await crypto.subtle.importKey(
      'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`),
    );
    if (!valid) throw new Error('Invalid token signature');

    if (!claims.email || !allowedEmails.includes(claims.email.toLowerCase())) {
      return message('This Cloudflare Access account is not allowed to manage the portfolio.', 403);
    }
    return null;
  } catch {
    return message('Cloudflare Access authentication could not be verified.', 401);
  }
}
