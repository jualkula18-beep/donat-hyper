export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/_api/")) {
      const apiPath = url.pathname.replace("/_api/", "");

      const apiRequest = new Request(
        `https://donat-hyper.pages.dev/functions/${apiPath}${url.search}`,
        request
      );

      return env.ASSETS.fetch(apiRequest);
    }

    return env.ASSETS.fetch(request);
  }
};
