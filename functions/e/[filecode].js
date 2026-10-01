export async function onRequest(context) {
  const filecode = context.params.filecode;

  if (!filecode) {
    return new Response("Video tidak ditemukan", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  const url = new URL(context.request.url);

  url.pathname = "/e/";

  return context.env.ASSETS.fetch(
    new Request(url, context.request)
  );
}
