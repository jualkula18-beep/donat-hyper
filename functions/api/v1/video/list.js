export async function onRequest(context) {
  const api = "https://api.vidara.so/v1/video/list";

  const url = new URL(api);

  url.searchParams.set(
    "api_key",
    context.env.VIDARA_API_KEY
  );

  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "40");

  const res = await fetch(url);

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json"
    }
  });
}
