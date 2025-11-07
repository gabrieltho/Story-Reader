# 📚 Novel Reader - Progressive Web App

A beautiful, installable web app that reads novels aloud using AI text-to-speech. Works on PC, iPhone, Android, and all modern devices!

## ✨ Features

- 🎤 **AI Text-to-Speech** - Uses your device's built-in voices
- 📱 **Installable** - Add to home screen like a native app
- 🌐 **Works Offline** - Read even without internet
- 📁 **File Import** - TXT and PDF support (with limitations)
- ⚙️ **Customizable** - Adjust speed, pitch, and voice
- 🎮 **Playback Controls** - Play, pause, stop, skip forward
- 📊 **Progress Tracking** - See how far through your novel you are
- 💾 **Works Everywhere** - PC, Mac, iPhone, Android

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages (FREE & EASY!)

This is the easiest way to use the app on your phone!

1. **Create a GitHub account** (free at github.com)

2. **Create a new repository:**
   - Name it: `novel-reader`
   - Make it public
   - Don't initialize with README

3. **Upload all files:**
   - `index.html`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png` (create using create-icons.html)
   - `icon-512.png` (create using create-icons.html)

4. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Click Save

5. **Access your app:**
   - Your app will be live at: `https://[your-username].github.io/novel-reader`
   - Open this URL on your iPhone or PC!

### Option 2: Use Python Local Server

Perfect for testing on your PC before deploying:

```bash
# Navigate to the folder with the files
cd /path/to/novel-reader

# Start a simple server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000` in your browser

### Option 3: Deploy to Netlify (Also FREE!)

1. Go to netlify.com and sign up (free)
2. Drag and drop all your files into Netlify
3. Get your live URL instantly!
4. Access from any device

### Option 4: Deploy to Vercel (FREE!)

1. Go to vercel.com and sign up
2. Import your GitHub repository OR upload files
3. Deploy with one click
4. Get your live URL

## 📱 Installing on iPhone

Once your app is deployed (using any option above):

1. **Open Safari** on your iPhone
2. **Navigate to your app URL**
3. **Tap the Share button** (square with arrow)
4. **Scroll down and tap "Add to Home Screen"**
5. **Tap "Add"** in the top right

The app icon will appear on your home screen like a real app!

## 💻 Installing on PC

### Chrome/Edge:
1. Open your app URL
2. Look for the install icon in the address bar (➕ or computer icon)
3. Click "Install"

### Or manually:
1. Click the three dots menu (⋮)
2. Select "Install [App Name]"

## 🎯 How to Use

### Import Text Methods:

1. **Choose File** - Import TXT files directly
   - Best for: Plain text novels, .txt files

2. **Paste Text** - Copy/paste from anywhere
   - Best for: Copying from websites, emails, documents

3. **Load Sample** - Try the built-in sample novel
   - Best for: Testing the app first

### Voice Controls:

- **Speed**: 0.5x (slow) to 2.0x (fast)
- **Pitch**: 0.5 (low) to 2.0 (high)
- **Voice**: Choose from your device's available voices

### Playback:

- ▶️ **Play/Pause**: Start or pause reading
- ⏹️ **Stop**: Stop and return to beginning
- ⏭️ **Skip**: Jump to next sentence

## 📝 File Format Support

### ✅ Fully Supported:
- **TXT** - Plain text files (best option)

### ⚠️ Limited Support:
- **PDF** - Basic support (may need manual copy/paste)
- **EPUB** - Not supported in browser (convert to TXT)
- **DOCX** - Not supported (copy/paste text instead)

### 💡 Tips:
- For best results, convert books to `.txt` format
- Or simply copy/paste text from any source
- Online tools can convert EPUB/PDF → TXT

## 🔧 Customization

Want to modify the app? Edit these files:

- `index.html` - Layout and structure
- `app.js` - Functionality and logic
- `manifest.json` - App name, colors, icons
- CSS in `<style>` tags - Appearance

## 🌐 Browser Compatibility

- ✅ Chrome (PC, Android)
- ✅ Safari (Mac, iPhone, iPad)
- ✅ Edge (PC)
- ✅ Firefox (PC, Android)
- ✅ Samsung Internet (Android)

## 📊 Technical Details

- **Size**: ~15 KB total (super lightweight!)
- **Offline**: Works without internet after first load
- **Storage**: Text stored in browser memory only
- **Privacy**: All processing happens on your device
- **No Backend**: Pure client-side application

## 🐛 Troubleshooting

**"No voices available"**
- Wait a few seconds for voices to load
- Check browser permissions for speech
- Try reloading the page

**"Can't install app"**
- Make sure you're using HTTPS (not HTTP)
- GitHub Pages uses HTTPS automatically
- Use a compatible browser

**"File won't import"**
- Try converting to .txt format
- Or use copy/paste instead
- Check file isn't corrupted

**"Voice sounds robotic"**
- Try different voices in settings
- Adjust speed and pitch
- Note: Quality depends on your device's voices

## 🎨 Creating Icons

1. Open `create-icons.html` in your browser
2. Download both generated icons
3. Save as `icon-192.png` and `icon-512.png`
4. Upload to your hosting

Or use any 192x192 and 512x512 PNG images you prefer!

## 🚀 Recommended Deployment: GitHub Pages

**Why GitHub Pages?**
- ✅ 100% Free
- ✅ Custom domain support
- ✅ Automatic HTTPS
- ✅ Easy updates (just upload new files)
- ✅ Reliable hosting

**Your app URL will be:**
`https://[your-username].github.io/novel-reader`

Share this URL with anyone to use your app!

## 📞 Support

Having issues? Common solutions:
1. Try a different browser
2. Clear cache and reload
3. Check if JavaScript is enabled
4. Ensure you have a stable internet connection (first load only)

## 📄 License

Free to use and modify for personal or commercial use!

## 🎉 Enjoy Reading!

Your personal AI-powered audiobook reader is ready to use. Happy reading! 📚✨
