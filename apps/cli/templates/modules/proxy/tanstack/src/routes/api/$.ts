import { createFileRoute } from "@tanstack/react-router";
import { getRequestIP } from "@tanstack/react-start/server";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// Forwards the /api/* requests no other route answers to the api, so the
// browser only talks to this app. Closing the request (a stop button) aborts
// the forwarded one too
async function forward({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("x-forwarded-host", url.host);
  // The api takes the client IP for its rate limits from this header, so it
  // is replaced, never passed on from the client: a client could pick its own
  const clientIp = getRequestIP();
  if (clientIp) headers.set("x-forwarded-for", clientIp);
  else headers.delete("x-forwarded-for");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(new URL(url.pathname + url.search, API_URL), {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // Node.js needs this to send a streamed request body
    ...(hasBody && { duplex: "half" }),
    redirect: "manual",
    signal: request.signal,
  } as RequestInit);

  // fetch has already decompressed the body, so these no longer describe it
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: forward,
      POST: forward,
      PUT: forward,
      PATCH: forward,
      DELETE: forward,
    },
  },
});
