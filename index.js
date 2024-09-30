const rx = /\/(?<seconds>[\d\.]+)\/(?<url>.+)/

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    if (new URL(request.url).pathname === "favicon.ico") {
      return emptyFaviconResponse()
    }

    try {
      const { seconds, url } = request.url.match(rx)?.groups
      if (!URL.canParse(url)) {
        return new Response(`Invalid URL "${url}"`, { status: 500 })
      }
      await sleep(parseFloat(seconds))
      return Response.redirect(url)
    } catch (e) {
      return new Response("Invalid Params" + e.message, { status: 500 })
    }
  }
}

function sleep(seconds = 1) {
  return new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000))
}

function emptyFaviconResponse() {
  return new Response(null, {
    status: 204,
    statusText: "No Content",
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=15552000"
    }
  })
}
