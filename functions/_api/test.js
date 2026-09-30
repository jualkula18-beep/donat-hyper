export function onRequest() {
  return new Response("FUNCTION BERHASIL", {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
