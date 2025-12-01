# Netlify Deployment Guide for RESUMIND

This guide walks you through deploying your React Router 7 resume analyzer app to Netlify.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (already done):
   ```bash
   git add .
   git commit -m "Add Netlify deployment config"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `Resumind` repository
   - Netlify will auto-detect the settings from `netlify.toml`

3. **Deploy Settings** (auto-configured):
   - **Build command**: `npm run build`
   - **Publish directory**: `build/client`
   - **Functions directory**: `netlify/functions`

### Option 2: Manual Deploy

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Drag and drop** the `build/client` folder to Netlify dashboard

## 🔧 Configuration Files Added

### `netlify.toml`
- Build settings and redirects
- Function configuration for SSR
- Performance optimization headers
- Security headers

### `netlify/functions/server.js`
- Serverless function for React Router SSR
- Handles all dynamic routes
- Converts Netlify events to standard requests

### Updated `package.json`
- Added Netlify-specific build scripts
- Optimized for serverless deployment

## 🌟 Features Supported

✅ **Server-Side Rendering (SSR)** - Full React Router 7 SSR support  
✅ **Dynamic Routes** - All routes work with proper SSR  
✅ **Static Assets** - Optimized delivery of images, CSS, JS  
✅ **PDF Processing** - Client-side PDF.js works perfectly  
✅ **File Uploads** - Puter.js integration for cloud storage  
✅ **AI Analysis** - Full Claude AI integration  
✅ **Authentication** - Puter.js auth system  

## 🎯 Post-Deployment Checklist

1. **Test Core Features**:
   - [ ] Authentication flow works
   - [ ] PDF upload and conversion
   - [ ] AI analysis completes
   - [ ] Resume viewing and feedback display
   - [ ] All routes navigate correctly

2. **Performance Optimization**:
   - [ ] Check Lighthouse scores
   - [ ] Verify asset caching
   - [ ] Test mobile responsiveness

3. **Environment Variables** (if needed):
   - Add any required env vars in Netlify dashboard
   - Go to Site Settings → Environment Variables

## 🔍 Troubleshooting

### Common Issues:

**Function timeout errors**:
- React Router functions have 10s timeout by default
- For longer AI processing, consider splitting operations

**Static asset 404s**:
- Check redirect rules in `netlify.toml`
- Verify assets are in `public/` directory

**PDF.js worker errors**:
- PDF worker file is included in `public/`
- Should work with relative paths

### Debug Commands:

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run typecheck

# Test function locally (with Netlify CLI)
netlify dev
```

## 🚀 Custom Domain (Optional)

1. Go to Site Settings → Domain management
2. Add your custom domain
3. Netlify will handle SSL automatically

## 📊 Analytics & Monitoring

Consider adding:
- **Netlify Analytics** - Built-in traffic analytics
- **Error tracking** - Sentry or similar
- **Performance monitoring** - Web Vitals

## 🔄 CI/CD Pipeline

Your deployment is now automated:
- **Push to main** → Automatic deployment
- **Pull requests** → Deploy previews
- **Branches** → Branch deploys

## 🎉 You're Live!

Once deployed, your resume analyzer will be available at:
`https://your-site-name.netlify.app`

The app includes:
- AI-powered resume analysis
- PDF upload and processing  
- Interactive feedback components
- Responsive design
- Full authentication system

---

**Need help?** Check the [Netlify docs](https://docs.netlify.com) or open an issue in the repository.