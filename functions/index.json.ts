import { PagesContext, listProjects } from './_lib/types';

// Public projection consumed by the portfolio. Internal R2 object keys and
// storage metadata stay private; the public site only needs display fields.
export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  const projects = await listProjects(env.PORTFOLIO_BUCKET);
  const published = projects.map(({ objectKey: _key, contentType: _type, size: _size, createdAt: _created, ...project }) => project);

  return new Response(JSON.stringify({ projects: published }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
