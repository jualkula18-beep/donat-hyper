export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ==============================
    // API VIDARA
    // ==============================
    if (url.pathname.startsWith("/_api/")) {
      try {
        const apiPath = url.pathname.replace(/^\/_api/, "");
        const target = new URL("https://api.vidara.so" + apiPath);

        // Teruskan semua query parameter
        for (const [key, value] of url.searchParams.entries()) {
          target.searchParams.set(key, value);
        }

        // API key Cloudflare
        if (!env.VIDARA_API_KEY) {
          return new Response(
            JSON.stringify({
              status: 500,
              error: "VIDARA_API_KEY belum tersedia"
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        target.searchParams.set("api_key", env.VIDARA_API_KEY);

        const response = await fetch(target.toString(), {
          method: "GET",
          headers: {
            "Accept": "application/json"
          }
        });

        const body = await response.text();

        return new Response(body, {
          status: response.status,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (error) {
        return new Response(
          JSON.stringify({
            status: 500,
            error: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // ==============================
    // PLAYER /e/xxxxx
    // ==============================
    if (url.pathname.startsWith("/e/")) {
      const playerUrl = new URL("/e/index.html", request.url);

      return env.ASSETS.fetch(
        new Request(playerUrl, {
          method: "GET",
          headers: request.headers
        })
      );
    }

    // ==============================
    // WEBSITE UTAMA
    // ==============================
    return env.ASSETS.fetch(request);
  }
};
