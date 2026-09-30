export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy API Vidara
    if (url.pathname.startsWith("/_api/")) {
      const apiPath = url.pathname.replace(/^\/_api/, "");
      const target = new URL("https://api.vidara.so" + apiPath);

      url.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });

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
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Pastikan /e/FILECODE membuka e/index.html
    if (url.pathname === "/e" || url.pathname.startsWith("/e/")) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/e/index.html";

      return env.ASSETS.fetch(
        new Request(assetUrl.toString(), request)
      );
    }

    // Asset lainnya
    return env.ASSETS.fetch(request);
  }
};
