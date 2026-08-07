const fs = require('fs');
const chokidar = require('chokidar');

const Logger = require('./logs');
const log = new Logger('HtmlInjector');

class HtmlInjector {
    constructor(filesPath, config) {
        this.filesPath = filesPath; // Array of file paths to cache
        this.cache = {}; // Object to store cached files
        this.config = config; // Configuration containing metadata (OG, title, etc.)
        this.injectData = this.getInjectData(); // Initialize dynamic injection data
        this.watcher = null; // File watcher instance

        this.preloadPages(filesPath); // Preload pages at startup
        this.watchFiles(filesPath); // Watch files for changes
        log.info('filesPath cached', this.filesPath);
    }

    // Function to get dynamic data for injection (e.g., OG data, title, app name, etc.)
    getInjectData() {
        const appName = this.config?.app?.name || process.env.APP_NAME || 'CineTalk';
        const developerName = process.env.DEVELOPER_NAME || 'Asif Shabbir';
        const developerLinkedinUrl = process.env.DEVELOPER_LINKEDIN_URL || 'https://www.linkedin.com/in/asif-shabbiir/';
        const developerContactLabel = process.env.DEVELOPER_CONTACT_LABEL || 'Contact Developer';

        const socialDiscordUrl = process.env.SOCIAL_DISCORD_URL || '#';
        const socialFacebookUrl = process.env.SOCIAL_FACEBOOK_URL || '#';
        const socialLinkedinUrl = process.env.SOCIAL_LINKEDIN_URL || developerLinkedinUrl;
        const socialYoutubeUrl = process.env.SOCIAL_YOUTUBE_URL || '#';
        const socialEmailUrl = process.env.SOCIAL_EMAIL_URL || '#';
        const socialSponsorUrl = process.env.SOCIAL_SPONSOR_URL || '#';
        const socialGithubStarUrl = process.env.SOCIAL_GITHUB_STAR_URL || 'https://github.com/yasirraheel/cinetalk';

        return {
            APP_NAME: appName,
            DEVELOPER_NAME: developerName,
            DEVELOPER_LINKEDIN_URL: developerLinkedinUrl,
            DEVELOPER_CONTACT_LABEL: developerContactLabel,
            SOCIAL_DISCORD_URL: socialDiscordUrl,
            SOCIAL_FACEBOOK_URL: socialFacebookUrl,
            SOCIAL_LINKEDIN_URL: socialLinkedinUrl,
            SOCIAL_YOUTUBE_URL: socialYoutubeUrl,
            SOCIAL_EMAIL_URL: socialEmailUrl,
            SOCIAL_SPONSOR_URL: socialSponsorUrl,
            SOCIAL_GITHUB_STAR_URL: socialGithubStarUrl,
            OG_TYPE: this.config?.og?.type || 'app-webrtc',
            OG_SITE_NAME: this.config?.og?.siteName || appName,
            OG_TITLE: this.config?.og?.title || 'Click the link to make a call.',
            OG_DESCRIPTION:
                this.config?.og?.description ||
                `${appName} calling provides real-time HD quality and latency simply not available with traditional technology.`,
            OG_IMAGE: this.config?.og?.image || 'https://p2p.mirotalk.com/images/preview.png',
            OG_URL: this.config?.og?.url || 'https://p2p.mirotalk.com',
            LANDING_TITLE: this.config?.site?.landingTitle || `${appName} a Free Secure Video Calls, Chat & Screen Sharing.`,
            NEWCALL_TITLE: this.config?.site?.newCallTitle || `${appName} a Free Secure Video Calls, Chat & Screen Sharing.`,
            CLIENT_TITLE: this.config?.site?.clientTitle || `${appName} WebRTC Video call, Chat Room & Screen Sharing.`,
            LOGIN_TITLE: this.config?.site?.loginTitle || `${appName} - Host Protected login required.`,
            PRIVACY_TITLE: this.config?.site?.privacyPolicyTitle || `${appName} - privacy and policy.`,
            NOTFOUND_TITLE: this.config?.site?.notFoundTitle || `${appName} - 404 Page not found.`,
            WAITINGROOM_TITLE: this.config?.site?.waitingRoomTitle || `${appName} - Waiting for host to start the meeting`,
        };
    }

    // Function to load a file into the cache
    loadFileToCache(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            this.cache[filePath] = content; // Store the content in cache
        } catch (err) {
            log.error(`Error reading file: ${filePath}`, err);
        }
    }

    // Function to preload pages into the cache
    preloadPages(filePaths) {
        filePaths.forEach((filePath) => this.loadFileToCache(filePath));
    }

    // Function to watch files for changes using chokidar
    watchFiles(filePaths) {
        if (this.watcher) {
            this.watcher.close(); // Close existing watcher if any
        }

        this.watcher = chokidar.watch(filePaths, {
            persistent: true,
            ignoreInitial: true, // Ignore initial 'add' events
        });

        this.watcher
            .on('change', (filePath) => {
                log.debug(`File changed: ${filePath}`);
                this.loadFileToCache(filePath);
                log.debug(`Reloaded file ${filePath} into cache`);
            })
            .on('error', (error) => {
                log.error(`Watcher error: ${error.message}`);
            });
    }

    // Function to inject dynamic data (e.g., OG, TITLE, APP_NAME, etc.) into a given file
    injectHtml(filePath, res) {
        // Check if HTML injection is enabled in the config
        if (!this.config?.htmlInjection) {
            return res.send(this.cache[filePath]);
        }

        if (!this.cache[filePath]) {
            log.error(`File not cached: ${filePath}`);
            if (!res.headersSent) {
                return res.status(500).send('Server Error');
            }
            return;
        }

        try {
            // Re-evaluate injectData dynamically in case config changed
            const injectData = this.getInjectData();

            // Replace placeholders with dynamic data (OG, TITLE, APP_NAME, etc.)
            const modifiedHTML = this.cache[filePath].replace(
                /{{([A-Z_]+)}}/g,
                (_, key) => (injectData[key] !== undefined ? injectData[key] : '')
            );

            if (!res.headersSent) {
                res.send(modifiedHTML);
            }
        } catch (error) {
            log.error('Error injecting HTML data:', error);
            if (!res.headersSent) {
                res.status(500).send('Server Error');
            }
        }
    }

    // Cleanup watcher when the instance is no longer needed
    cleanup() {
        if (this.watcher) {
            this.watcher.close();
        }
    }
}

module.exports = HtmlInjector;
