const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/secondary-winners", "/grand-winner"],
    createProxyMiddleware({
      target:
        "http://localhost:9090", // Your backend service URL
      changeOrigin: false,
      followRedirects: true,
    })
  );
};
