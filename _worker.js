export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/_api/v1/video/list")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/functions/_api/v1/video/list", request.url),
          request
        )
      );
    }

    return env.ASSETS.fetch(request);
  }
};
