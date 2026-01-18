# Paradise Playground - Deployment Guide for SiteGround

## ✅ Build Complete!

Your static playground site has been successfully built and is ready to deploy to SiteGround.

## 📦 What's in the `out` folder?

```
out/
├── index.html           # Homepage
├── playground/          # Interactive playground
│   └── index.html
├── learn/               # Learning resources
│   └── index.html
├── docs/                # Issue documentation (39 files)
├── _next/               # JavaScript, CSS, and assets
└── [other assets]
```

## 🚀 Deployment Steps

### Option 1: FTP Upload (FileZilla - Recommended)

1. **Download FileZilla** (if you don't have it)
   - https://filezilla-project.org/

2. **Get your SiteGround FTP credentials**
   - Log into SiteGround
   - Go to Site Tools > Devs > FTP Accounts
   - Note your hostname, username, and password

3. **Connect to SiteGround**
   - Open FileZilla
   - Host: `your-hostname.siteground.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
   - Click "Quickconnect"

4. **Navigate to the upload directory**
   - On the remote site (right panel), navigate to `/public_html`
   - Or `/public_html/subdirectory` if you want it in a subdirectory

5. **Upload the files**
   - On your local site (left panel), navigate to:
     `/Users/bob3/Desktop/phd/Action Language/app/playground-site/out`
   - Select ALL files and folders inside the `out` folder
   - Drag and drop them to the remote `/public_html` folder
   - Wait for the upload to complete (may take a few minutes)

6. **Test your site**
   - Visit your domain: `http://yourdomain.com`
   - Or subdirectory: `http://yourdomain.com/subdirectory`

### Option 2: cPanel File Manager

1. **Create a ZIP file**
   ```bash
   cd "/Users/bob3/Desktop/phd/Action Language/app/playground-site/out"
   zip -r ../playground-site.zip .
   ```

2. **Log into SiteGround cPanel**
   - Site Tools > cPanel

3. **Upload the ZIP file**
   - Open File Manager
   - Navigate to `public_html`
   - Click "Upload"
   - Select `playground-site.zip` from:
     `/Users/bob3/Desktop/phd/Action Language/app/playground-site/`
   - Wait for upload to complete

4. **Extract the ZIP file**
   - Right-click on `playground-site.zip`
   - Select "Extract"
   - Choose `public_html` as the destination
   - Click "Extract File(s)"

5. **Delete the ZIP file**
   - Select `playground-site.zip`
   - Click "Delete"

6. **Test your site**
   - Visit your domain: `http://yourdomain.com`

## 🔧 Troubleshooting

### Site shows default page
- Make sure `index.html` is in the root of `public_html`
- Check file permissions (should be 644 for files, 755 for folders)

### Missing styles or JavaScript
- Ensure the `_next` folder was uploaded completely
- Clear your browser cache
- Check browser console for 404 errors

### 404 errors on navigation
- The site uses client-side routing
- Make sure ALL files and folders were uploaded
- The `trailingSlash: true` setting ensures proper routing

### Playground not working
- Check browser console for errors
- Ensure all files in `_next/static` were uploaded
- Monaco editor files should be in `_next/static/chunks`

## 📊 Site Structure After Upload

Your `public_html` folder should look like this:

```
public_html/
├── index.html
├── 404.html
├── playground/
│   └── index.html
├── learn/
│   └── index.html
├── docs/
│   └── issues/
│       └── [39 markdown files]
├── _next/
│   ├── static/
│   │   ├── chunks/
│   │   ├── css/
│   │   └── media/
│   └── ...
└── [favicon and other assets]
```

## ✨ What Works

- ✅ Beautiful landing page
- ✅ Interactive playground with Monaco editor
- ✅ Real-time accessibility analysis (runs client-side)
- ✅ 15+ specialized analyzers
- ✅ Documentation viewer
- ✅ Click-to-jump error highlighting
- ✅ Learn page with tutorials

## 🌐 Live Site Features

Once deployed, users can:

1. **Homepage** (`/`)
   - Learn about accessibility
   - Navigate to playground or learn page

2. **Playground** (`/playground/`)
   - Write HTML, JavaScript, and CSS
   - Get real-time accessibility feedback
   - Click issues to jump to error locations
   - View comprehensive documentation for each issue

3. **Learn** (`/learn/`)
   - Study accessibility fundamentals
   - See code examples
   - Access external resources

## 🔄 Making Updates

When you make changes to the site:

1. Rebuild the site:
   ```bash
   cd "/Users/bob3/Desktop/phd/Action Language/app/playground-site"
   npm run build -- --webpack
   ```

2. Re-upload the `out` folder contents to SiteGround
   - You can overwrite existing files
   - Or delete everything in `public_html` first, then upload fresh

## 📧 Need Help?

If you encounter issues:
- Check SiteGround's support documentation
- Verify FTP credentials are correct
- Ensure you have enough disk space on your hosting
- Check file permissions (644 for files, 755 for directories)

---

**Deployment Ready!** 🎉

Your Paradise Playground is now ready to help people learn web accessibility!
