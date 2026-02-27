# 📱 Install Mining Bot as an App

Your Mining Bot is now a **Progressive Web App (PWA)**! Users can install it directly from their browser and use it like a native app.

## ✨ Features

- 📲 Install directly from browser (no app store needed)
- 🚀 Fast loading and offline support
- 📱 Works on Android, iOS, Windows, Mac, Linux
- 🔔 Push notifications support (can be added)
- 💾 Reduced data usage with caching
- 🎯 Full-screen experience

## 📥 How Users Can Install

### Android (Chrome/Edge)

1. Open your website in Chrome or Edge
2. Look for the "Install" prompt at the bottom of the screen
3. Tap "Install" or tap the menu (⋮) → "Install app" or "Add to Home screen"
4. The app icon will appear on your home screen
5. Open it like any other app!

### iOS (Safari)

1. Open your website in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"
5. The app icon will appear on your home screen

### Desktop (Chrome/Edge)

1. Open your website in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click "Install" in the popup
4. The app will open in its own window
5. Access it from your desktop or start menu

### Desktop (Other Browsers)

- **Firefox**: Currently limited PWA support, but you can bookmark it
- **Safari (Mac)**: Click File → Add to Dock

## 🔧 For Developers

### Build and Deploy

```bash
cd web
npm install
npm run build
npm start
```

### Testing PWA Locally

1. Build the production version: `npm run build`
2. Start production server: `npm start`
3. Open in browser: `http://localhost:3000`
4. Open DevTools → Application → Manifest to verify
5. Use Lighthouse to test PWA score

### PWA Requirements Checklist

✅ HTTPS enabled (required for PWA)
✅ manifest.json configured
✅ Service worker registered
✅ Icons (192x192 and 512x512)
✅ Responsive design
✅ Offline fallback (handled by next-pwa)

### Customization

#### Update App Name and Colors

Edit `web/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

#### Replace Icons

Replace these files in `web/public/`:
- `icon.svg` - Main icon (any size)
- `icon-192.svg` - Small icon
- `icon-512.svg` - Large icon

Or use PNG files and update manifest.json accordingly.

#### Customize Install Prompt

Edit `web/src/components/InstallPrompt.tsx` to change:
- Timing (currently shows after 30 seconds)
- Design and colors
- Text and messaging

### Disable PWA in Development

PWA is automatically disabled in development mode. To disable in production:

Edit `web/next.config.ts`:

```typescript
export default withPWA({
  dest: 'public',
  disable: true, // Set to true to disable
})(nextConfig);
```

## 🚀 Deployment

### Deploy to Production

Your PWA will work on any hosting platform that supports HTTPS:

- **Vercel**: Automatic PWA support
- **Netlify**: Automatic PWA support
- **Your own server**: Ensure HTTPS is enabled

### HTTPS Requirement

PWAs require HTTPS. Options:
- Use ngrok for testing: `ngrok http 3000`
- Use Let's Encrypt for free SSL certificates
- Deploy to Vercel/Netlify (automatic HTTPS)

## 📊 Testing PWA

### Chrome DevTools

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Manifest: Verify all fields
   - Service Workers: Should be registered
   - Storage: Check cache storage

### Lighthouse Audit

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 90+ score

### Test on Real Devices

- Test installation on actual Android/iOS devices
- Verify offline functionality
- Check icon appearance
- Test app behavior in standalone mode

## 🎯 Best Practices

1. **Icons**: Use high-quality, recognizable icons
2. **Name**: Keep short_name under 12 characters
3. **Colors**: Match your brand colors
4. **Testing**: Test on multiple devices and browsers
5. **Updates**: Service worker updates automatically
6. **Offline**: Ensure critical features work offline

## 🐛 Troubleshooting

### Install Button Not Showing

- Ensure you're using HTTPS
- Check manifest.json is valid
- Verify service worker is registered
- Try in incognito mode
- Check browser console for errors

### App Not Installing

- Clear browser cache
- Check manifest.json syntax
- Verify all icon files exist
- Ensure HTTPS is working
- Try different browser

### Service Worker Issues

```bash
# Clear service worker cache
# In DevTools → Application → Service Workers → Unregister
# Then refresh the page
```

## 📱 User Benefits

When users install your app:

- **Faster**: Instant loading from home screen
- **Offline**: Works without internet (cached content)
- **Native Feel**: Full-screen, no browser UI
- **Reliable**: Always accessible from home screen
- **Engaging**: Can receive notifications (if enabled)

## 🔄 Updates

The service worker automatically updates when you deploy new versions:

1. User opens the app
2. Service worker checks for updates
3. New version downloads in background
4. Updates apply on next app restart

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [next-pwa GitHub](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Your app is now installable! Share your website URL and users can install it directly from their browser.** 🎉
