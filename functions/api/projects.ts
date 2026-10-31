import { PagesContext, listProjects } from '../_lib/types';

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  const projects = await listProjects(env.PORTFOLIO_BUCKET);
  return new Response(JSON.stringify(projects.map(({ objectKey: _key, contentType: _type, size: _size, createdAt: _created, ...project }) => project)), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
