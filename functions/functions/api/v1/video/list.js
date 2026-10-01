export async function onRequest() {
  return new Response(JSON.stringify({
    status: 200,
    result: {
      videos: [
        {
          filecode: "test123",
          title: "Video Test",
          thumbnail: "https://picsum.photos/400/600"
        }
      ]
    }
  }), {
    headers: {
      "content-type": "application/json"
    }
  });
}
