// SEO and Performance Optimization - Sitemap Generator
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://unforgivingminute.netlify.app';
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/calculator', priority: '0.9', changefreq: 'weekly' },
  { loc: '/plans', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'daily' },
  { loc: '/premium', priority: '0.7', changefreq: 'monthly' },
  { loc: '/profile', priority: '0.6', changefreq: 'weekly' }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully!');
