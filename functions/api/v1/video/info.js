export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);
  const filecode = requestUrl.searchParams.get("filecode");

  if (!filecode) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: "filecode wajib diisi"
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }

  if (!context.env.VIDARA_API_KEY) {
    return new Response(
      JSON.stringify({
        status: 500,
        error: "VIDARA_API_KEY belum tersedia"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }

  const api = new URL(
    "https://api.vidara.so/v1/video/info"
  );

  api.searchParams.set(
    "api_key",
    context.env.VIDARA_API_KEY
  );

  api.searchParams.set(
    "filecode",
    filecode
  );

  const res = await fetch(api);

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") ||
        "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
