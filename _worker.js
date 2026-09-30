export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    console.log("WORKER AKTIF:", url.pathname);

    // ==============================
    // TEST WORKER
    // ==============================
    if (url.pathname === "/_api/test") {
      return new Response("FUNCTION BERHASIL", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    // ==============================
    // API VIDARA
    // ==============================
    if (url.pathname.startsWith("/_api/")) {
      try {
        if (!env.VIDARA_API_KEY) {
          return new Response(
            JSON.stringify({
              status: 500,
              error: "VIDARA_API_KEY belum tersedia di Cloudflare"
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            }
          );
        }

        const apiPath = url.pathname.replace(/^\/_api/, "");

        const target = new URL(
          "https://api.vidara.so" + apiPath
        );

        for (const [key, value] of url.searchParams.entries()) {
          target.searchParams.set(key, value);
        }

        target.searchParams.set(
          "api_key",
          env.VIDARA_API_KEY
        );

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
            "Content-Type":
              response.headers.get("Content-Type") ||
              "application/json; charset=utf-8",
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
              "Content-Type": "application/json; charset=utf-8"
            }
          }
        );
      }
    }
