export async function onRequest(context) {
  const url = new URL(context.request.url);

  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "40";
  const title = url.searchParams.get("title") || "";

  const apiUrl = new URL("https://api.vidara.so/v1/video/list");

  apiUrl.searchParams.set("api_key", context.env.VIDARA_API_KEY);
  apiUrl.searchParams.set("page", page);
  apiUrl.searchParams.set("limit", limit);

  if (title) {
    apiUrl.searchParams.set("title", title);
  }

  const response = await fetch(apiUrl);

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type": "application/json"
    }
  });
}
