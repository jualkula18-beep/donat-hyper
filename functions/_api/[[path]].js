export async function onRequest(context) {
  const { request, env, params } = context;

  try {
    if (!env.VIDARA_API_KEY) {
      return new Response(
        JSON.stringify({
          status: 500,
          error: "VIDARA_API_KEY belum tersedia"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const path = Array.isArray(params.path)
      ? "/" + params.path.join("/")
      : "/" + (params.path || "");

    const target = new URL("https://api.vidara.so" + path);

    const incoming = new URL(request.url);

    for (const [key, value] of incoming.searchParams.entries()) {
      target.searchParams.set(key, value);
    }

    target.searchParams.set("api_key", env.VIDARA_API_KEY);

    const response = await fetch(target.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 500,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
