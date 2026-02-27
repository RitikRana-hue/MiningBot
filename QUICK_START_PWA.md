# 🚀 Quick Start - Install Your App

Your Mining Bot is now a **Progressive Web App**! Users can install it directly from their browser.

## ✅ What's Been Set Up

- ✓ Service Worker for offline support
- ✓ Web App Manifest with app info
- ✓ Install prompt that appears automatically
- ✓ App icons (placeholder - replace with your logo)
- ✓ Responsive design for all devices

## 📱 How to Test Installation

### 1. Start Production Server

```bash
cd web
npm run build
npm start
```

Your app will run at `http://localhost:3000`

### 2. Test on Desktop (Chrome/Edge)

1. Open `http://localhost:3000` in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click it and select "Install"
4. The app opens in its own window!

### 3. Test on Mobile

For mobile testing, you need HTTPS. Use ngrok:

```bash
# Install ngrok if you haven't
# Then run:
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and open it on your phone.

**On Android:**
- Chrome will show "Add to Home screen" banner
- Or tap menu (⋮) → "Install app"

**On iOS:**
- Safari: Tap Share → "Add to Home Screen"

## 🎨 Customize Your App

### 1. Replace Icons

Replace these files in `web/public/`:
- `icon.svg` - Main app icon
- `icon-192.svg` - Small icon (192x192)
- `icon-512.svg` - Large icon (512x512)

Or use PNG files and update `manifest.json`

### 2. Update App Info

Edit `web/public/manifest.json`:

```json
{
  "name": "Your Full App Name",
  "short_name": "Short Name",
  "description": "Your app description",
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### 3. Customize Install Prompt

Edit `web/src/components/InstallPrompt.tsx` to change:
- When it appears (currently after 30 seconds)
- Design and colors
- Text and messaging

## 🌐 Deploy to Production

### Option 1: Vercel (Easiest)

```bash
cd web
npm install -g vercel
vercel
```

Vercel automatically provides HTTPS!

### Option 2: Your Own Server

Requirements:
- HTTPS enabled (required for PWA)
- Node.js installed

```bash
# Build the app
npm run build

# Start production server
npm start
```

### Option 3: Ngrok (Testing/Demo)

```bash
# Start your app
npm start

# In another terminal
ngrok http 3000
```

Share the HTTPS URL with anyone!

## 📊 Verify PWA Setup

### Chrome DevTools

1. Open your app in Chrome
2. Press F12 to open DevTools
3. Go to "Application" tab
4. Check:
   - **Manifest**: Should show your app info
   - **Service Workers**: Should show "activated and running"
   - **Storage**: Check cache storage

### Lighthouse Test

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 90+ score

## 🎯 User Installation Flow

1. User visits your website
2. After 30 seconds, install prompt appears
3. User clicks "Install Now"
4. App installs to home screen
5. User can launch it like any native app!

## ✨ Features Users Get

- **Offline Access**: Works without internet (cached content)
- **Fast Loading**: Instant startup from home screen
- **Native Feel**: Full-screen, no browser UI
- **Always Accessible**: Icon on home screen/desktop
- **Auto Updates**: Updates automatically when you deploy

## 🔧 Troubleshooting

### Install Button Not Showing

- Make sure you're using HTTPS (or localhost)
- Check browser console for errors
- Try incognito/private mode
- Verify manifest.json is valid

### Service Worker Not Registering

- Check browser console for errors
- Make sure `/sw.js` is accessible
- Clear browser cache and try again
- Verify you're in production mode

### App Not Installing on Mobile

- Ensure HTTPS is enabled
- Check that all icon files exist
- Verify manifest.json is valid JSON
- Try different browser (Chrome on Android, Safari on iOS)

## 📱 Browser Support

- ✅ Chrome (Android, Desktop)
- ✅ Edge (Desktop)
- ✅ Safari (iOS, Mac) - Limited PWA features
- ✅ Samsung Internet
- ⚠️ Firefox - Limited PWA support

## 🎉 You're Done!

Your app is now installable! Share your URL and users can install it directly from their browser.

**Next Steps:**
1. Replace placeholder icons with your logo
2. Customize colors in manifest.json
3. Test on real devices
4. Deploy to production with HTTPS
5. Share your app URL!

---

Need help? Check `PWA_INSTALLATION_GUIDE.md` for detailed documentation.
