# Deployment Guide

This guide outlines the process for deploying the **whowhe2wha** Single-Page Application (SPA) to a production environment using Nginx as the web server.

## Overview

The application is built as a set of static files (`index.html`, JavaScript, CSS, etc.). The deployment process involves compiling these files into an optimized production-ready bundle and configuring a web server to serve them correctly.

## Prerequisites

1.  **A Server:** A Linux server (e.g., Ubuntu, CentOS) with SSH access.
2.  **Nginx:** Nginx installed and running on the server.
3.  **Domain Name:** A domain name configured to point to your server's IP address.
4.  **SSL Certificate:** An SSL certificate (e.g., from Let's Encrypt) to serve the site over HTTPS, which is required for PWA functionality.
5.  **Node.js & npm (for build step):** A build environment with Node.js to compile the application.

## Step 1: The Build Process

While the development environment runs the code directly, a production deployment requires a **build step** to optimize the application for performance and security.

1.  **Install a Build Tool:** Tools like **Vite** or **Create React App** are excellent choices for this.
2.  **Configure the Base Path:** If you plan to serve the app from a sub-path (e.g., `https://your-domain.com/whowhe2wha/`), you must configure this in your build tool. For Vite, you would set `base: '/whowhe2wha/'` in the `vite.config.ts` file. This ensures all asset links in the final `index.html` are correct.
3.  **Run the Build Command:** Execute the build command (e.g., `npm run build`). This will compile the TypeScript code, bundle the JavaScript, and place all the optimized static files into a `dist` (or `build`) directory.

This `dist` directory is what you will deploy to the server.

## Step 2: Deploying the Files

1.  **Connect to your server** via SSH.
2.  **Create a directory** for your application files within Nginx's web root, for example: `sudo mkdir -p /var/www/html/whowhe2wha`.
3.  **Copy the contents** of your local `dist` folder to the server directory you just created. You can use a tool like `scp` or `rsync` for this.

Example using `scp`:
```bash
scp -r ./dist/* your_user@your_server_ip:/var/www/html/whowhe2wha/
```

## Step 3: Nginx Configuration

The final step is to tell Nginx how to serve your application's files.

1.  **Open the Nginx configuration file** for your site. This is typically located in `/etc/nginx/sites-available/your-domain.com`.
2.  **Add a `location` block** for your application. This tells Nginx to serve the files from the directory you created when a user visits the specified URL path.

### Sample Nginx Configuration

This example shows how to serve the app from `https://your-domain.com/whowhe2wha/`.

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;

    # The root directory for your domain
    root /var/www/html;
    index index.html;

    # SSL Certificate configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    # ... other SSL settings

    # Location block for the whowhe2wha application
    location /whowhe2wha/ {
        # The 'alias' directive maps this URL path to a specific directory on your server.
        # Note the trailing slash on both the location and the alias path.
        alias /var/www/html/whowhe2wha/;

        # This is the crucial part for Single-Page Applications (SPAs).
        # It tells Nginx to first try to serve the requested file ($uri).
        # If it can't find it, it will fall back to serving the main index.html file.
        # This allows the client-side React Router to handle all application routes.
        try_files $uri $uri/ /whowhe2wha/index.html;
    }

    # ... other location blocks for other apps or your main site
}
```

3.  **Test and Reload Nginx:**
    -   Test your configuration for syntax errors: `sudo nginx -t`
    -   If the test is successful, reload Nginx to apply the changes: `sudo systemctl reload nginx`

Your application should now be live and accessible at `https://your-domain.com/whowhe2wha/`.