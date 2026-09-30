export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ==========================================
    // 1. API VIDARA
    // ==========================================
    if (url.pathname.startsWith("/_api/")) {
      const apiPath = url.pathname.replace(/^\/_api/, "");

      const target = new URL(
        "https://api.vidara.so" + apiPath
      );

      // Teruskan semua query parameter
      for (const [key, value] of url.searchParams.entries()) {
        target.searchParams.set(key, value);
      }

      // API key dari Cloudflare Environment Variable
      if (env.VIDARA_API_KEY) {
        target.searchParams.set(
          "api_key",
          env.VIDARA_API_KEY
        );
      }

      // Kirim request ke Vidara
      const response = await fetch(target.toString(), {
        method: request.method,
        headers: {
          "Accept": "application/json"
        }
      });

      // Kembalikan response Vidara ke website
      const headers = new Headers();

      headers.set(
        "Content-Type",
        response.headers.get("Content-Type") ||
          "application/json"
      );

      headers.set(
        "Cache-Control",
        "no-store"
      );

      headers.set(
        "Access-Control-Allow-Origin",
        "*"
      );

      return new Response(
        response.body,
        {
          status: response.status,
          headers
        }
      );
    }


    // ==========================================
    // 2. HALAMAN VIDEO /e/xxxxx
    // ==========================================
    if (url.pathname.startsWith("/e/")) {
      const playerUrl = new URL(
        "/e/index.html",
        request.url
      );

      return env.ASSETS.fetch(
        new Request(
          playerUrl,
          {
            method: "GET",
            headers: request.headers
          }
        )
      );
    }


    // ==========================================
    // 3. WEBSITE UTAMA
    // ==========================================
    return env.ASSETS.fetch(request);
  }
};
