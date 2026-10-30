# ArjuVisuals.co

Premium photography & visual storytelling portfolio for **Arjun Murali** — freelance commercial photographer, videographer, and visual editor in Thrissur, Kerala.

**Tagline:** Turning moments into timeless visuals.

This repository currently ships the **frontend** (React + Vite). It is prepared for a later Node.js, Express, MongoDB, and Cloudinary backend.

## Stack

- React 19 + Vite
- React Router
- Framer Motion
- React Icons
- Custom CSS design system (Cyprus green / sand / black)
- Fetch API service layer (local data now, HTTP later)

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Public routes

| Path | Page |
| --- | --- |
| `/` | Cinematic home |
| `/portfolio` | Gallery + filters |
| `/portfolio/:slug` | Project detail + lightbox |
| `/about` | Arjun Murali |
| `/services` | Creative services |
| `/contact` | Project inquiry (demo submit) |

## Admin prototype

| Path | Page |
| --- | --- |
| `/admin/login` | Demo login |
| `/admin/dashboard` | Overview |
| `/admin/projects` | Project CRUD |
| `/admin/projects/new` | New project |
| `/admin/projects/:id/edit` | Edit project |
| `/admin/services` | Service management |
| `/admin/inquiries` | Inquiry desk |
| `/admin/profile` | Biography & contact |

Demo login: any email with `@` and a password of 4+ characters. **This is not authentication.** Session is a `sessionStorage` flag only.

## What works now

- Full public portfolio UI, navigation, and animations
- Category filters, project pages, keyboard lightbox
- Contact form validation and local demo save
- Admin CRUD against `localStorage`
- Profile-driven biography on the About page
- Central `src/services/api.js` for a future `VITE_API_URL`

## What needs a backend

- Real login, sessions, and password hashing
- Persistent database (MongoDB)
- Cloudinary (or similar) image uploads
- Actual delivery of contact inquiries (email / stored records)
- Data shared across devices and browsers

`localStorage` is not a database, not secure, and not shared. Local image previews are not permanent uploads.

## Replacing placeholder photography

Curated Pexels frames currently illustrate layout and direction. Swap URLs in:

- `src/data/images.js`
- `src/data/projects.js`
- `src/data/photographer.js`

…or upload originals later via Cloudinary and the admin project form.

## Brand colours

- Dark Red `#270707` (Main dark background, footer, hero, admin)
- Stone `#F1EBEB` (Main light background, content panels, light editorial layouts)
- Deep Red `#660810` (Primary brand accent, CTAs, active indicators, filter tags)
- Pure white `#FFFFFF`
- Soft white `#F8F4F4`
- Muted gray `#B8AAAA`
- Dark border `#492A2C`
- Subtle red tint `#8A2630`
