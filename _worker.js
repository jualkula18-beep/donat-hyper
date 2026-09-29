export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/_api/")) {
      const apiPath = url.pathname.replace(/^\/_api/, "");
      const target = new URL("https://api.vidara.so" + apiPath);

      // Teruskan query dari browser
      url.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });

      // Tambahkan API key dari Cloudflare Secret/Variable
      if (env.VIDARA_API_KEY) {
        target.searchParams.set("api_key", env.VIDARA_API_KEY);
      }

      const response = await fetch(target.toString(), {
        method: request.method,
        headers: {
          "Accept": "application/json"
        }
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") || "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
