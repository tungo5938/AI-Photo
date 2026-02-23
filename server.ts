import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // OAuth URL endpoint
  app.get('/api/auth/url', (req, res) => {
    let origin = process.env.APP_URL;
    
    if (!origin) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'];
      origin = `${protocol}://${host}`;
    }
    
    // Ensure no trailing slash for the base origin
    origin = origin.replace(/\/$/, '');
    const redirectUri = `${origin}/auth/callback`;

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '179661839982-uulblfg4pkdrvk43h17fsd0ujfm55pc5.apps.googleusercontent.com',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: authUrl });
  });

  // OAuth Callback
  app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    
    // In a real app, you'd exchange the code for tokens here
    // For this demo, we'll just simulate success
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: { name: 'Demo User' } }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
