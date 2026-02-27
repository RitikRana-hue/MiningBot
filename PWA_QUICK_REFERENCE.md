# 📱 PWA Quick Reference Card

## 🚀 Quick Commands

```bash
# Test locally
cd web && npm run build && npm start

# Test PWA features
# Visit: http://localhost:3000/pwa-test.html

# Test on mobile (with HTTPS)
ngrok http 3000

# Deploy to Vercel
cd web && vercel
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `web/public/sw.js` | Service worker (caching, offline) |
| `web/public/manifest.json` | App metadata (name, icons, colors) |
| `web/public/icon*.svg` | App icons (REPLACE WITH YOUR LOGO) |
| `web/src/components/InstallPrompt.tsx` | Install prompt UI |

## 🎨 Customization

### 1. Replace Icons
```bash
# Replace these in web/public/
icon.svg        # Main icon
icon-192.svg    # Small (192x192)
icon-512.svg    # Large (512x512)
```

### 2. Update App Info
Edit `web/public/manifest.json`:
- `name` - Full app name
- `short_name` - Home screen name (max 12 chars)
- `theme_color` - App theme color
- `background_color` - Splash screen color

### 3. Customize Install Prompt
Edit `web/src/components/InstallPrompt.tsx`:
- Line 21: Change timing (30000ms = 30 seconds)
- Modify colors, text, design

## 📱 Installation Methods

### Android
- Chrome: Auto prompt or Menu → "Install app"
- Edge: Auto prompt or Menu → "Install app"

### iOS
- Safari: Share → "Add to Home Screen"

### Desktop
- Chrome/Edge: Install icon in address bar

## ✅ Testing Checklist

```bash
# 1. Build
npm run build

# 2. Start
npm start

# 3. Test
# ✓ Visit http://localhost:3000
# ✓ Open /pwa-test.html
# ✓ Check DevTools → Application → Manifest
# ✓ Check DevTools → Application → Service Workers
# ✓ Try installing the app
# ✓ Test offline (DevTools → Network → Offline)
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
cd web
vercel
```

### Netlify
```bash
npm install -g netlify-cli
cd web
npm run build
netlify deploy --prod
```

### Ngrok (Testing)
```bash
npm start
ngrok http 3000
# Share the HTTPS URL
```

## 🐛 Quick Fixes

### Install button not showing?
- Use HTTPS or localhost
- Clear cache
- Try incognito mode

### Service worker not working?
- Run `npm run build` (production mode)
- Check `/sw.js` is accessible
- Clear browser cache

### Icons not displaying?
- Verify files exist in `web/public/`
- Check manifest.json paths
- Clear cache

## 📊 Verification

### Chrome DevTools
1. F12 → Application tab
2. Check Manifest (all fields present)
3. Check Service Workers (activated)
4. Check Cache Storage (has cached files)

### Lighthouse
1. F12 → Lighthouse tab
2. Select "Progressive Web App"
3. Generate report
4. Score should be 90+

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START_PWA.md` | Get started in 5 minutes |
| `PWA_INSTALLATION_GUIDE.md` | Complete documentation |
| `INSTALLATION_STEPS.md` | User installation guide |
| `PWA_SUMMARY.md` | Implementation summary |
| `README_PWA.md` | PWA overview |

## 🎯 Requirements

- ✅ HTTPS (or localhost)
- ✅ manifest.json
- ✅ Service worker
- ✅ Icons (192x192, 512x512)
- ✅ Responsive design

All requirements are met! Just deploy with HTTPS.

## 💡 Pro Tips

1. **Test on real devices** - Emulators don't show install prompts
2. **Use HTTPS** - Required for PWA (except localhost)
3. **Replace icons** - Use your actual logo, not placeholders
4. **Short name** - Keep under 12 characters for home screen
5. **Test offline** - Verify cached content works

## 🎉 Success Indicators

- ✅ Install icon appears in browser
- ✅ App installs to home screen
- ✅ Works offline
- ✅ Lighthouse PWA score > 90
- ✅ No console errors
- ✅ Service worker active

## 📞 Need Help?

1. Check `/pwa-test.html` for diagnostics
2. Review `PWA_INSTALLATION_GUIDE.md`
3. Check browser console for errors
4. Verify HTTPS is enabled

---

**Your app is ready to install! Just share your URL.** 🚀
