export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/_api/test") {
      return new Response("WORKER HIDUP", {
        headers: {
          "content-type": "text/plain"
        }
      });
    }

    return new Response("WORKER JALAN: " + url.pathname);
  }
};
