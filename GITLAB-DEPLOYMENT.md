# 🦊 Deploy Novel Reader to GitLab Pages

Complete step-by-step guide to deploy your Novel Reader app using GitLab Pages (FREE!)

---

## 📋 What You'll Need

- A computer (PC or Mac - just for initial setup)
- 10 minutes of time
- The novel-reader-app.zip file (downloaded from this conversation)

---

## 🚀 Step-by-Step Guide

### Step 1: Create GitLab Account (2 minutes)

1. **Go to GitLab.com**
   - Open your browser
   - Navigate to: `https://gitlab.com`

2. **Sign Up (FREE)**
   - Click the blue **"Register"** or **"Sign up"** button
   - Choose one option:
     - Sign up with Google (fastest)
     - Sign up with GitHub
     - Sign up with email
   
3. **If using email:**
   - Enter your name
   - Enter your username (this will be in your URL!)
   - Enter your email
   - Create a password
   - Click **"Register"**
   - Check your email and verify your account

4. **Complete Profile** (optional but recommended)
   - Add a profile picture if you want
   - Skip the survey or fill it out
   - Choose "Just me" for team size

---

### Step 2: Create a New Project (1 minute)

1. **From your GitLab dashboard:**
   - Click the **"New project"** button (usually blue, top right)
   - OR click **"Create a project"**

2. **Choose "Create blank project"**

3. **Fill in project details:**
   - **Project name:** `novel-reader` (or any name you like)
   - **Project URL:** 
     - Should show: `gitlab.com/[your-username]/novel-reader`
     - The username is automatically filled
   - **Visibility Level:** Choose **"Public"** (required for GitLab Pages)
   - **Project Configuration:**
     - ❌ UNCHECK "Initialize repository with a README"
     - ❌ Leave everything else unchecked

4. **Click "Create project"**

You now have an empty GitLab repository!

---

### Step 3: Extract the Zip File (1 minute)

1. **Locate the downloaded zip file:**
   - Should be in your Downloads folder
   - Named: `novel-reader-app.zip`

2. **Extract it:**
   - **Windows:** Right-click → "Extract All" → Choose location → Extract
   - **Mac:** Double-click the zip file (extracts automatically)
   
3. **You should now have a folder** called `novel-reader-app` with these files:
   ```
   novel-reader-app/
   ├── index.html
   ├── app.js
   ├── sw.js
   ├── manifest.json
   ├── icon-192.png
   ├── icon-512.png
   ├── START-HERE.md
   ├── QUICK-START.md
   ├── README.md
   ├── VISUAL-GUIDE.md
   ├── test-locally.bat
   └── test-locally.sh
   ```

---

### Step 4: Upload Files to GitLab (3 minutes)

**You have two options: Web Upload (Easy) or Git (Advanced)**

---

#### **OPTION A: Web Upload (Recommended - Easier)**

1. **On your project page, click the blue "+" button**
   - Or look for **"Upload file"** or **"+ New file"**

2. **Click "Upload file"**

3. **Upload the core app files ONE BY ONE:**
   
   **First, upload these 6 REQUIRED files:**
   - `index.html`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
   
   **How to upload each file:**
   - Click "Choose file" or drag and drop
   - Select the file from your extracted folder
   - Target branch: leave as "main" or "master"
   - Commit message: (leave default or type "Add [filename]")
   - Click **"Upload file"**
   - Repeat for each file

4. **Optional: Upload documentation files too:**
   - `README.md`
   - `START-HERE.md`
   - `QUICK-START.md`
   - `VISUAL-GUIDE.md`

**Note:** You can also upload multiple files at once by selecting them all!

---

#### **OPTION B: Git Upload (Advanced - Faster if you know Git)**

1. **Open Terminal (Mac/Linux) or Git Bash (Windows)**

2. **Navigate to your extracted folder:**
   ```bash
   cd ~/Downloads/novel-reader-app
   # Or wherever you extracted the files
   ```

3. **Initialize Git and upload:**
   ```bash
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Commit files
   git commit -m "Initial commit - Novel Reader app"
   
   # Add GitLab remote (replace YOUR-USERNAME with your actual username)
   git remote add origin https://gitlab.com/YOUR-USERNAME/novel-reader.git
   
   # Push to GitLab
   git branch -M main
   git push -u origin main
   ```

4. **When prompted:**
   - Enter your GitLab username
   - Enter your GitLab password
   - (Or use a Personal Access Token - GitLab will guide you)

---

### Step 5: Enable GitLab Pages (2 minutes)

**Important:** GitLab Pages may take 5-10 minutes to build for the first time.

1. **In your project, go to the left sidebar:**
   - Click **"Settings"** (bottom of left menu)
   - Click **"Pages"** (under Settings)

2. **Check if Pages is already enabled:**
   - You should see: "Access pages: https://[username].gitlab.io/novel-reader"
   - If you see this, **you're done!** Skip to Step 6.

3. **If Pages isn't working yet, create `.gitlab-ci.yml` file:**

   a. **Go back to your project main page**
   
   b. **Click the "+" button → "New file"**
   
   c. **File name:** `.gitlab-ci.yml` (exactly like this, with the dot)
   
   d. **Paste this content:**
   ```yaml
   pages:
     stage: deploy
     script:
       - mkdir .public
       - cp -r * .public
       - mv .public public
     artifacts:
       paths:
         - public
     only:
       - main
   ```
   
   e. **Commit message:** "Add GitLab Pages configuration"
   
   f. **Click "Commit changes"**

4. **Wait for deployment:**
   - Go to **"CI/CD" → "Pipelines"** in the left menu
   - You should see a pipeline running (blue icon)
   - Wait 2-5 minutes for it to complete (turns green)
   - If it fails (red X), don't worry - GitLab Pages might still work

5. **Get your URL:**
   - Go back to **"Settings" → "Pages"**
   - Your app URL will be shown:
     ```
     https://[your-username].gitlab.io/novel-reader
     ```
   - Copy this URL!

---

### Step 6: Test Your App! (1 minute)

1. **Open the URL in your browser:**
   ```
   https://[your-username].gitlab.io/novel-reader
   ```
   
2. **You should see your Novel Reader app!**
   - Beautiful purple/blue gradient background
   - "📚 Novel Reader" title
   - "Add Your Novel" section
   - Import buttons

3. **Test it:**
   - Click "Load Sample"
   - Click the Play button ▶️
   - Listen to it read!

**If it works - SUCCESS!** 🎉

---

### Step 7: Install on iPhone (1 minute)

1. **On your iPhone, open Safari** (must be Safari!)

2. **Navigate to your app URL:**
   ```
   https://[your-username].gitlab.io/novel-reader
   ```

3. **Add to Home Screen:**
   - Tap the **Share button** (square with arrow pointing up)
   - Scroll down and tap **"Add to Home Screen"**
   - Tap **"Add"** (top right)

4. **Done!** 
   - App icon appears on your home screen
   - Tap it to open like a native app
   - Works offline after first load!

---

## 🎯 Your App URLs

After setup, your app will be accessible at:

**Main URL:**
```
https://[your-username].gitlab.io/novel-reader
```

**Example:**
If your username is "johndoe", your URL would be:
```
https://johndoe.gitlab.io/novel-reader
```

Share this URL with anyone to use your app!

---

## 🔧 Troubleshooting

### Problem: "404 Page Not Found"

**Solution 1:** Wait longer
- GitLab Pages can take 5-10 minutes to deploy
- Check "CI/CD → Pipelines" to see if it's still building
- Green checkmark = deployed

**Solution 2:** Make sure project is Public
- Settings → General → Visibility
- Change to "Public"
- Save changes

**Solution 3:** Check if .gitlab-ci.yml was created correctly
- Go to your repository
- Look for `.gitlab-ci.yml` file
- Make sure it has the correct content (from Step 5)

---

### Problem: "Files uploaded but app not working"

**Check these:**

1. **All 6 core files uploaded?**
   - index.html ✓
   - app.js ✓
   - sw.js ✓
   - manifest.json ✓
   - icon-192.png ✓
   - icon-512.png ✓

2. **Files in root directory?**
   - Files should be at the top level, not in a subfolder
   - URL should be: `gitlab.io/username/novel-reader` 
   - NOT: `gitlab.io/username/novel-reader/subfolder`

3. **Wait for pipeline to finish**
   - CI/CD → Pipelines
   - Should show green checkmark

---

### Problem: "Can't add to iPhone home screen"

**Solutions:**

1. **Must use Safari browser** (not Chrome)
   - Only Safari supports "Add to Home Screen" for PWAs on iPhone

2. **Make sure you're on the actual app page**
   - Not on GitLab.com
   - On your app URL: `username.gitlab.io/novel-reader`

3. **Check if HTTPS is enabled**
   - URL should start with `https://`
   - GitLab Pages uses HTTPS by default

---

### Problem: "Pipeline failed (red X)"

**Don't worry!** Often the app still works even if pipeline shows failed.

1. **Try accessing your URL anyway**
   - Settings → Pages
   - Copy the URL
   - Open in browser

2. **If that doesn't work:**
   - Delete the `.gitlab-ci.yml` file
   - Re-upload it with correct formatting
   - Make sure it's in the root directory

---

### Problem: "No voices available"

This is a browser issue, not GitLab:

1. **Wait 5-10 seconds** after page loads
2. **Reload the page**
3. **Check browser permissions** for speech
4. **Try a different browser**

---

## 📊 What Just Happened?

Here's what you did:

1. ✅ Created a FREE GitLab account
2. ✅ Created a repository (project)
3. ✅ Uploaded your app files
4. ✅ Enabled GitLab Pages
5. ✅ Got a live URL for your app
6. ✅ Installed it on your iPhone

**Total cost: $0.00**
**Total time: ~10 minutes**

---

## 🎨 Customizing Your App

Want to change colors, text, or features?

1. **Edit files directly on GitLab:**
   - Click on any file (like `index.html`)
   - Click "Edit" button
   - Make your changes
   - Click "Commit changes"
   - Wait 2-3 minutes for redeployment

2. **Download, edit locally, and re-upload:**
   - Download the file
   - Edit on your computer
   - Upload the new version (overwrites old one)

Changes appear automatically at your URL after pipeline completes!

---

## 🔄 Updating Your App

To update the app in the future:

1. **Edit files on GitLab** (easiest):
   - Click file → Edit → Commit changes

2. **Or re-upload new files**:
   - Click "+" → Upload file
   - Select "Overwrite if already exists"

3. **Wait for pipeline to finish**
   - Changes live in 2-5 minutes

---

## 💡 Pro Tips

1. **Bookmark your app URL** for easy access

2. **Share your URL** with friends and family

3. **Keep GitLab login info safe** - you'll need it to update the app

4. **The app works offline** after first load - perfect for reading anywhere!

5. **Free forever** - GitLab Pages is completely free for public projects

---

## 🌟 What You Can Do Now

✅ Read novels on your iPhone with AI voice
✅ Works offline
✅ Customize speed, pitch, and voice
✅ Track your reading progress
✅ Import TXT files or paste text
✅ Looks and feels like a native app
✅ Share the URL with anyone

---

## 📞 Still Need Help?

**Common Quick Fixes:**

- **Can't find uploaded files?** → Check you're in the right project
- **URL not working?** → Wait 5 more minutes, check pipeline status
- **Voices not loading?** → Wait, reload page, or try different browser
- **Can't install on iPhone?** → Must use Safari, not Chrome

**Remember:**
- Your project must be **Public** (not Private)
- Pipeline must complete (green checkmark)
- Give it 5-10 minutes after first deployment

---

## 🎉 Congratulations!

You've successfully deployed your Novel Reader app to GitLab Pages!

**Your app is now:**
- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Installable on iPhone/Android
- ✅ Free forever
- ✅ Easy to update

**Enjoy your personal AI-powered audiobook reader!** 📚🎧

---

## 🔗 Quick Reference

**Your GitLab Project:**
```
https://gitlab.com/[your-username]/novel-reader
```

**Your Live App:**
```
https://[your-username].gitlab.io/novel-reader
```

**To Update App:**
1. Go to your GitLab project
2. Edit files directly or upload new ones
3. Wait 2-5 minutes
4. Refresh your app URL

**To Share:**
Just send your app URL to anyone!

---

**Need anything else? The app is ready to use! 🚀**
