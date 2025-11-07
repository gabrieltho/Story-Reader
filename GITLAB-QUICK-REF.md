# 🦊 GitLab Deployment - QUICK REFERENCE

## 📋 What You Need
- Computer (PC or Mac)
- 10 minutes
- novel-reader-app-UPDATED.zip (download from outputs)

---

## ⚡ SUPER QUICK STEPS

### 1. CREATE ACCOUNT (2 min)
→ Go to **gitlab.com**
→ Click **"Register"**
→ Sign up (email or Google)
→ Verify email

### 2. CREATE PROJECT (1 min)
→ Click **"New project"**
→ Choose **"Create blank project"**
→ Name: `novel-reader`
→ Visibility: **Public** ⚠️ IMPORTANT
→ UNCHECK "Initialize with README"
→ Click **"Create project"**

### 3. EXTRACT ZIP (30 sec)
→ Download **novel-reader-app-UPDATED.zip**
→ Right-click → Extract All (Windows)
→ Or double-click (Mac)

### 4. UPLOAD FILES (3 min)
→ In GitLab project, click **"+"** button
→ Click **"Upload file"**
→ Upload these 7 files ONE BY ONE:
   1. index.html
   2. app.js
   3. sw.js
   4. manifest.json
   5. icon-192.png
   6. icon-512.png
   7. .gitlab-ci.yml ⚠️ Don't forget this!
→ Click "Upload file" after each

### 5. ENABLE PAGES (2 min)
→ Left sidebar: **Settings** → **Pages**
→ Wait 5-10 minutes for deployment
→ Copy your URL:
   ```
   https://[username].gitlab.io/novel-reader
   ```

### 6. INSTALL ON IPHONE (1 min)
→ Open Safari on iPhone
→ Go to your URL
→ Tap Share button (⬆️)
→ Tap **"Add to Home Screen"**
→ Tap **"Add"**

---

## ✅ DONE!

Your app is live at:
```
https://[YOUR-USERNAME].gitlab.io/novel-reader
```

Replace [YOUR-USERNAME] with your actual GitLab username.

---

## 🆘 TROUBLESHOOTING

### "404 Not Found"
→ Wait 5 more minutes (deployment takes time)
→ Check: Settings → Pages for status
→ Make sure project is **Public**

### "Files won't upload"
→ Upload one at a time, not all together
→ Make sure you're in the right project
→ Try refreshing the page

### "Pipeline failed"
→ Try accessing URL anyway (often still works)
→ Check if .gitlab-ci.yml is in root folder
→ Verify .gitlab-ci.yml content is correct

### "Can't install on iPhone"
→ MUST use Safari (not Chrome)
→ Make sure you're on app URL, not gitlab.com
→ Wait until page fully loads

---

## 📱 AFTER INSTALLATION

Your app will:
✅ Appear on iPhone home screen
✅ Work offline
✅ Look like a native app
✅ Update automatically when you change files

---

## 🔄 TO UPDATE APP LATER

1. Go to gitlab.com/[username]/novel-reader
2. Click file you want to edit
3. Click "Edit" button
4. Make changes
5. Click "Commit changes"
6. Wait 2-3 minutes
7. Refresh your app URL

---

## 💡 IMPORTANT NOTES

⚠️ Project MUST be **Public** (not Private)
⚠️ Don't forget to upload **.gitlab-ci.yml**
⚠️ First deployment takes 5-10 minutes
⚠️ Use Safari on iPhone for installation

---

## 📞 YOUR URLs

**Project (for editing):**
https://gitlab.com/[username]/novel-reader

**Live App (for using):**
https://[username].gitlab.io/novel-reader

**Share the live app URL with anyone!**

---

## 🎉 SUCCESS CHECKLIST

✅ GitLab account created
✅ Project created (public)
✅ 7 files uploaded (including .gitlab-ci.yml)
✅ Pipeline completed (green checkmark)
✅ URL works in browser
✅ Installed on iPhone home screen
✅ App reads sample text aloud

**ALL DONE! Enjoy reading! 📚**

---

For detailed instructions, see: **GITLAB-DEPLOYMENT.md**
