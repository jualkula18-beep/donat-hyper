export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Vidara
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
            response.headers.get("Content-Type") ||
            "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    // Semua URL /e/xxxxx diarahkan ke halaman player
    if (url.pathname.startsWith("/e/")) {
      const playerUrl = new URL("/e/index.html", request.url);

      return env.ASSETS.fetch(
        new Request(playerUrl, {
          method: "GET",
          headers: request.headers
        })
      );
    }

    // Selain itu tampilkan website biasa
    return env.ASSETS.fetch(request);
  }
};
