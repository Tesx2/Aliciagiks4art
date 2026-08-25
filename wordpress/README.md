# Headless WordPress setup for Aliciagiks4art

## 1. Install the plugin

1. Host WordPress on any provider (WordPress.com Business, SiteGround, Cloudways, etc.).
2. Upload `aliciagiks-portfolio-cms.php` to `wp-content/plugins/`.
3. Activate **Aliciagiks4art Portfolio CMS** in the WordPress admin.

The plugin registers:

| Item | Details |
|------|---------|
| Post type | `projects` → REST: `/wp-json/wp/v2/projects` |
| Taxonomy | `project_category` (Branding, Motion, Illustration, Graphic) |
| Meta fields | `client`, `role`, `project_date`, `video_url`, `featured`, `process_stills` |
| REST payload | `portfolio` object with image width, height, aspect ratio |

## 2. Add a project

In **Projects → Add New**:

- **Title** — project name
- **Excerpt** — short brief (shown on case study)
- **Content** — full description (optional)
- **Featured image** — main visual (width/height exposed in API)
- **Categories** — Branding / Motion / Illustration / Graphic
- **Custom fields** (block editor sidebar or Custom Fields panel):
  - `client` — e.g. `Acme Co.`
  - `role` — e.g. `Art Direction & Motion`
  - `project_date` — e.g. `2025`
  - `video_url` — MP4 URL for motion projects (leave empty for images)
  - `featured` — `1` to pin on homepage featured row
  - `process_stills` — array of attachment IDs, e.g. `[123,124,125]`

> **Tip:** Install [Advanced Custom Fields](https://www.advancedcustomfields.com/) and map the same field names for a friendlier UI. The REST keys stay identical.

## 3. Connect Netlify

Edit `cms-config.js` on the Netlify site:

```js
window.CMS_CONFIG = {
  apiBase: 'https://your-wordpress-site.com',
  perPage: 100,
};
```

Replace with your live WordPress URL (HTTPS, no trailing slash).

CORS is pre-configured for `https://aliciagiks4art.netlify.app`. Add local dev origins in the plugin's `ALLOWED_ORIGINS` array if needed.

## 4. API examples

List all projects:

```
GET https://your-wordpress-site.com/wp-json/wp/v2/projects?per_page=100&_embed
```

Single project by slug:

```
GET https://your-wordpress-site.com/wp-json/wp/v2/projects?slug=my-project-slug&_embed
```

Each item includes a `portfolio` object:

```json
{
  "portfolio": {
    "slug": "motion-campaign-reel",
    "title": "Motion Campaign Reel",
    "category": "Motion",
    "brief": "Social motion system for a product launch.",
    "client": "Acme Co.",
    "role": "Motion Designer",
    "year": "2025",
    "featured": true,
    "type": "video",
    "src": "https://…/reel.mp4",
    "width": 1920,
    "height": 1080,
    "aspect_ratio": 1.7778,
    "process_stills": [{ "src": "…", "width": 1200, "height": 1600 }]
  }
}
```

## 5. Fallback

If the WordPress API is unreachable, the Netlify site falls back to `geeks4drisony/manifest.json` so the portfolio keeps working during setup.

## 6. Publishing workflow

1. Add or edit a project in WordPress → **Publish**.
2. Refresh `aliciagiks4art.netlify.app` — the grid updates live (no Netlify redeploy).
