var PROXY_CONF = {
    '/api': {
      target: 'http://localhost:5237',
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
      // logProvider: logProvider, // (3) replace this with 
      configure: (proxy, _options) => {
        proxy.on("error", (err, _req, _res) => {
          console.log("proxy error", err);
        });
        proxy.on("proxyReq", (proxyReq, req, _res) => {
          const headers = proxyReq.getHeaders();
          // console.log(headers);
          console.log(
            req.method,
            req.url,
            " -> ",
            `${headers.host}${proxyReq.path}`,
          );
        });
        proxy.on("proxyRes", (proxyRes, req, _res) => {
          console.log(
            req.method,
            "Target Response",
            proxyRes.statusCode,
            ":",
            req.url,
          );
        });
      },
      pathRewrite: {
        '^/api': '',
      },
    },
  };
  
  module.exports = PROXY_CONF;