export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname === "/_api/test") {
    return new Response("WORKER HIDUP");
  }

  return context.next();
}
