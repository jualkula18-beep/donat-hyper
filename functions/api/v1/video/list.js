export async function onRequest(context) {
  const api = "https://api.vidara.so/v1/video/list";

  const url = new URL(api);

  url.searchParams.set(
    "api_key",
    context.env.VIDARA_API_KEY
  );

  const requestUrl = new URL(context.request.url);
  const page = requestUrl.searchParams.get("page") || "1";

  url.searchParams.set("page", page);
  url.searchParams.set("limit", "10");

  const res = await fetch(url);

  const text = await res.text();

  return new Response(text, {
    headers: {
      "content-type": "application/json"
    }
  });
}
