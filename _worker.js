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

        // Teruskan query parameter
        for (const [key, value] of url.searchParams.entries()) {
          target.searchParams.set(key, value);
        }

        // API key dari Cloudflare
        if (env.VIDARA_API_KEY) {
          target.searchParams.set(
            "api_key",
            env.VIDARA_API_KEY
          );
        } else {
          return new Response(
            JSON.stringify({
              status: 500,
              error: "VIDARA_API_KEY belum tersedia di Cloudflare"
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
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
      const playerUrl = new URL(
        "/e/index.html",
        request.url
      );

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
