export async function onRequest(context) {
  try {
    const api = "https://api.vidara.so/v1/video/list";

    const url = new URL(api);

    url.searchParams.set(
      "api_key",
      context.env.VIDARA_API_KEY
    );

    const res = await fetch(url);

    const text = await res.text();

    return new Response(JSON.stringify({
      status_vidara: res.status,
      hasil: text
    }), {
      headers: {
        "content-type": "application/json"
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
