import { createAuth } from '../../_lib/auth';
import { PagesContext, message } from '../../_lib/types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
  try {
    const auth = createAuth(context.env);
    return await auth.handler(context.request);
  } catch {
    return message('Authentication is not configured. Add the Better Auth bindings and secrets, then redeploy.', 503);
  }
};
