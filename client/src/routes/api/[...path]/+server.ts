import type { RequestHandler } from './$types';
import { API_UPSTREAM } from '$env/static/private';

function makeUpstreamUrl(requestUrl: URL) {
  // requestUrl.pathname on esim. /api/courses
  // API_UPSTREAM on esim. http://server:8000 tai http://localhost:8000 tai https://backend.deno.dev
  return new URL(requestUrl.pathname + requestUrl.search, API_UPSTREAM);
}

export const GET: RequestHandler = async (event) => {
  const upstream = makeUpstreamUrl(event.url);
  const res = await fetch(upstream, {
    method: 'GET',
    headers: event.request.headers
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
};

export const POST: RequestHandler = async (event) => {
  const upstream = makeUpstreamUrl(event.url);
  const res = await fetch(upstream, {
    method: 'POST',
    headers: event.request.headers,
    body: await event.request.arrayBuffer()
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
};

export const PUT: RequestHandler = async (event) => {
  const upstream = makeUpstreamUrl(event.url);
  const res = await fetch(upstream, {
    method: 'PUT',
    headers: event.request.headers,
    body: await event.request.arrayBuffer()
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
};

export const DELETE: RequestHandler = async (event) => {
  const upstream = makeUpstreamUrl(event.url);
  const res = await fetch(upstream, {
    method: 'DELETE',
    headers: event.request.headers
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
};
