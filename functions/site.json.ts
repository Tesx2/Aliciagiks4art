import { PagesContext } from './_lib/types';
import { getSiteContent } from './_lib/site';

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => new Response(JSON.stringify(await getSiteContent(env.PORTFOLIO_BUCKET)), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    'X-Content-Type-Options': 'nosniff',
  },
});
