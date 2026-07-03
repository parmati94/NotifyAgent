// CRA dev-server proxy: gives `npm start` the same /api rewrite that nginx
// performs in the production container, so the client code never needs to
// know where the API lives. Override the target with API_PROXY_TARGET when
// the backend isn't on localhost:8000 (e.g. docker-compose.dev.yml).
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
};
