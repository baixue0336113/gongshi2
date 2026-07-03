import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Custom transparent reverse-proxy for the Xianyu production API endpoints
  app.all("/api/*", (req, res) => {
    const targetHost = "www.szxianyu.net";
    const targetPath = req.originalUrl;

    const headers = { ...req.headers };
    headers.host = targetHost; // Overwrite host header for routing

    // Remove any client-specific connections headers to prevent hang-ups
    delete headers.connection;
    delete headers["keep-alive"];

    const proxyReq = https.request(
      {
        host: targetHost,
        path: targetPath,
        method: req.method,
        headers: headers,
      },
      (proxyRes) => {
        // Set same status code and forward response headers
        res.status(proxyRes.statusCode || 500);
        Object.entries(proxyRes.headers).forEach(([key, val]) => {
          if (val !== undefined) {
            res.setHeader(key, val);
          }
        });
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", (err) => {
      console.error("API Proxy Error:", err);
      // Give a JSON 502, the React client will gracefully fall back to full interactive mock mode
      res.status(502).json({
        error: "Bad Gateway",
        message: "无法连接到鲜誉经营舱服务器，请检查网络或切换为模拟数据模式。",
        details: err.message
      });
    });

    // Pipe the incoming request body to the outgoing proxy request
    req.pipe(proxyReq);
  });

  // Setup Vite development server or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Xianyu Cockpit Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
