const STRIDE_PREFIX = "/stride";
const GUIDE_PATH = `${STRIDE_PREFIX}/api/guide`;

async function guide(request, env) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not permitted." }, { status: 405, headers: { Allow: "POST" } });
  }
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Origin not permitted." }, { status: 403 });
  }
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "Sign in before requesting an explanation." }, { status: 401 });
  }
  if (Number(request.headers.get("Content-Length") || 0) > 4096) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }
  try {
    const response = await fetch(`${env.SUPABASE_URL}/functions/v1/guide`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        Origin: env.SUPABASE_GUIDE_ORIGIN,
      },
      body: await request.text(),
      signal: AbortSignal.timeout(30_000),
    });
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store");
    headers.delete("Access-Control-Allow-Origin");
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return Response.json(
      { error: "The AI service could not be reached.", code: "AI_UNAVAILABLE" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === GUIDE_PATH) {
      return guide(request, env);
    }

    if (url.pathname === STRIDE_PREFIX) {
      url.pathname = "/";
    } else if (url.pathname.startsWith(`${STRIDE_PREFIX}/`)) {
      url.pathname = url.pathname.slice(STRIDE_PREFIX.length) || "/";
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
