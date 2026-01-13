#!/usr/bin/env node

/**
 * Simple HTTP server for the accessibility demo
 * Usage: node serve.js [port]
 * Default port: 8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8080;
const DEMO_DIR = __dirname;

// MIME types for common file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  // Parse URL and remove query string
  let filePath = req.url.split('?')[0];

  // Default to index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Construct absolute file path
  const absolutePath = path.join(DEMO_DIR, filePath);

  // Security check: ensure requested path is within demo directory
  if (!absolutePath.startsWith(DEMO_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(absolutePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(`404 - ${filePath}`);
      return;
    }

    // Get MIME type based on file extension
    const ext = path.extname(absolutePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        console.error(`Error reading file: ${err}`);
        return;
      }

      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
      console.log(`200 - ${filePath}`);
    });
  });
});

server.listen(PORT, () => {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│  Accessibility Demo Server                              │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log('');
  console.log(`  Server running at: http://localhost:${PORT}/`);
  console.log(`  Demo directory:    ${DEMO_DIR}`);
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
  console.log('─────────────────────────────────────────────────────────');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});
