import { yoga } from '@/cms/schema';

/**
 * The content API, also exposed over HTTP.
 *
 * The page renderer executes queries in-process, so this route exists for the things that need a
 * real endpoint: GraphiQL at /api/graphql for exploring the schema, and the end-to-end tests,
 * which query it the way an external client would.
 *
 * Yoga's handler takes its own context object, so it is wrapped rather than exported directly —
 * Next's route handlers are typed to receive a bare Request.
 */
async function handler(request: Request): Promise<Response> {
  return yoga.handleRequest(request, {});
}

export { handler as GET, handler as POST, handler as OPTIONS };
