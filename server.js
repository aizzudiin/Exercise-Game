const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers including CSP tailored for current project
app.use((req, res, next) => {
  // Adjust CSP to allow current CDN and inline handlers used in HTML templates
  const csp = [
    "default-src 'self'",
    // Allow scripts from self and CDNs; allow inline for now due to onclick/onchange in UI templates
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdnjs.cloudflare.com",
    // Explicitly allow external script elements from the same sources
    "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdnjs.cloudflare.com",
    // Allow styles from self and Google Fonts/CDNs; inline for dynamic styles and Bootstrap
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdnjs.cloudflare.com",
    // Allow fonts
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
    // Allow images from self and data URIs
    "img-src 'self' data: blob:",
    // Allow fetch/XHR/WebAssembly asset downloads for MediaPipe from CDNs
    "connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdnjs.cloudflare.com https://fonts.gstatic.com data: blob:",
    // Allow web workers (used by some libraries for performance)
    "worker-src 'self' blob:",
    // Media (audio/video)
    "media-src 'self'",
    // Disallow plugins
    "object-src 'none'",
    // Restrict framing
    "frame-ancestors 'self'",
    // Base URI
    "base-uri 'self'"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  next();
});

// Serve static files from project root
const rootDir = __dirname;
app.use(express.static(rootDir, { extensions: ['html'] }));

// Fallback to index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Workout Game running at http://localhost:${PORT}`);
});
