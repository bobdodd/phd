# Paradise Playground - Static Site

A standalone, accessibility-focused playground for learning and testing web accessibility in real-time.

## Features

- ✅ Beautiful landing page focused on accessibility learning
- ✅ Interactive playground with Monaco editor
- ✅ 15+ specialized accessibility analyzers
- ✅ Real-time issue detection
- ✅ Comprehensive documentation for each issue type
- ✅ Click-to-jump error location highlighting
- ✅ Learn page with tutorials and examples
- ✅ Configured for static export to deploy on SiteGround

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Building for Production

### Build Static Site

```bash
npm run build
```

This will generate static HTML/CSS/JS files in the `out/` directory.

## Deploying to SiteGround

### Option 1: FTP Upload (Recommended)

1. **Build the static site**:
   ```bash
   npm run build
   ```

2. **Connect via FTP**:
   - Host: Your SiteGround FTP hostname (found in Site Tools)
   - Port: 21
   - Username: Your FTP username
   - Password: Your FTP password
   - Use FileZilla or any FTP client

3. **Upload files**:
   - Navigate to `/public_html` on the server (or `/public_html/subdirectory` if using a subdirectory)
   - Upload ALL contents of the `out/` folder
   - Make sure to upload the folder structure intact

### Option 2: cPanel File Manager

1. **Build the static site**:
   ```bash
   npm run build
   ```

2. **Compress the out folder**:
   ```bash
   cd out
   zip -r ../playground-site.zip .
   ```

3. **Upload via cPanel**:
   - Log into SiteGround cPanel
   - Open File Manager
   - Navigate to `public_html`
   - Upload `playground-site.zip`
   - Extract the zip file
   - Delete the zip file

### Important Notes

- The `out/` folder contains all static files needed
- All files must be uploaded to maintain the correct structure
- The site will work immediately after upload (no server configuration needed)
- The playground analyzers run entirely client-side (no server required)

## Project Structure

```
playground-site/
├── app/
│   ├── page.tsx          # Homepage
│   ├── playground/       # Interactive playground
│   │   └── page.tsx
│   └── learn/            # Learning resources
│       └── page.tsx
├── public/
│   └── docs/             # Issue documentation (39 files)
├── src/
│   └── lib/              # Analyzers and models
├── out/                  # Build output (after npm run build)
└── next.config.ts        # Configured for static export
```

## Tech Stack

- **Next.js 16** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor
- **React Markdown** - Documentation rendering
- **ActionLanguage** - Accessibility analysis framework

## License

MIT
