<div align="center">
    <h1 align="center">🎬 CineTalk</h1>
    <h3 align="center">Open Source WebRTC P2P Video Conferencing Platform</h3>
    <p align="center">Free, Secure, Fast Real-Time Communication - up to 8K, 60fps. Works in All Browsers and Mobile Platforms.</p>
</div>

<br />

---

## 🚀 Quick Start

Get **CineTalk** up and running on your local machine or server in minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/yasirraheel/cinetalk.git
cd cinetalk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Configuration
```bash
# On Windows PowerShell:
Copy-Item .env.template .env
Copy-Item app/src/config.template.js app/src/config.js

# On Linux / macOS:
cp .env.template .env
cp app/src/config.template.js app/src/config.js
```

### 4. Start the Application
```bash
# Standard mode
npm start

# Development mode (auto-reload)
npm run start-dev
```

Open your browser and visit: **`http://localhost:3000`**

---

## 🎨 Dynamic Rebranding & Social Links

**CineTalk** includes a fully dynamic rebranding system. You can change the platform name, developer contact, and social links across all page titles, headers, OpenGraph metadata, privacy policy, and footers directly from your [`.env`](.env) file without modifying source code:

1. Open your [`.env`](.env) file.
2. Configure your brand, developer contact, and social links:
   ```env
   # App Name
   APP_NAME=CineTalk

   # Developer / Contact Info
   DEVELOPER_NAME=Asif Shabbir
   DEVELOPER_LINKEDIN_URL=https://www.linkedin.com/in/asif-shabbiir/
   DEVELOPER_CONTACT_LABEL=Contact Developer

   # Social Links
   SOCIAL_DISCORD_URL=#
   SOCIAL_FACEBOOK_URL=#
   SOCIAL_LINKEDIN_URL=https://www.linkedin.com/in/asif-shabbiir/
   SOCIAL_YOUTUBE_URL=#
   SOCIAL_EMAIL_URL=#
   SOCIAL_SPONSOR_URL=#
   SOCIAL_GITHUB_STAR_URL=https://github.com/yasirraheel/cinetalk
   ```
3. Restart the server. All page titles, headings, meta tags, developer links, and footer social links update automatically.

---

## ✨ Features

- 🎥 **High-Definition Video & Audio**: Up to 8K resolution at 60fps powered by WebRTC P2P.
- 🖥️ **Screen Sharing**: Share full screens, application windows, or browser tabs.
- 💬 **Real-time Chat**: Integrated chat room with message saving and privacy controls.
- ⏺️ **Meeting Recording**: Record screens, webcams, and audio locally directly in your browser.
- 🎨 **Interactive Whiteboard**: Collaborative drawing board to explain ideas visually during calls.
- 📁 **File Sharing**: Secure peer-to-peer file transfers using DTLS encryption.
- 🔌 **REST API**: Create rooms and integrate meetings dynamically with external applications.
- 🔒 **Total Privacy & Security**: No persistent data collection; direct encrypted peer-to-peer connections.

---

## 🐳 Docker Deployment

To run CineTalk using Docker:

```bash
# Build & run container
docker-compose up -d
```

Or using npm docker scripts:
```bash
npm run docker:build
npm run docker:run
```

---

## 📄 License

AGPL-3.0 License.
