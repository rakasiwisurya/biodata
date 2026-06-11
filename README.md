# Rakasiwi Surya — Portfolio & Biodata

Personal portfolio website with a hidden admin dashboard, rebuilt from a static
template into a fullstack app.

| Route    | Purpose                                                                  |
| -------- | ------------------------------------------------------------------------ |
| `/`      | Public portfolio for HR / talent acquisition (rendered from PostgreSQL) |
| `/admin` | Hidden dashboard (not linked anywhere) to edit all content without code |

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **PostgreSQL** via **Prisma 6**
- **MinIO** object storage (avatar, project images, CV PDF)
- **Auth.js v5 (NextAuth)** — Google sign-in with email allowlist for `/admin`
- Swiper, next-themes (dark/light mode), react-hook-form + zod

## Getting started

```bash
npm install
cp .env.example .env        # fill in values (see below)
npx prisma migrate dev      # create tables
npx prisma db seed          # upload assets to MinIO + insert CV data
npm run dev                 # http://localhost:3000
```

## Environment variables (`.env`)

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `MINIO_ENDPOINT` / `MINIO_PORT` / `MINIO_USE_SSL` | MinIO server |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO credentials |
| `MINIO_BUCKET` | Bucket name (created + made public-read by the seed) |
| `MINIO_PUBLIC_URL` | Public base URL used to build object URLs |
| `AUTH_SECRET` | Session encryption secret (`npx auth secret`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client (see below) |
| `ADMIN_EMAILS` | Comma-separated Google emails allowed into `/admin` |
| `AUTH_TRUST_HOST` | Set `true` when running behind a reverse proxy |

## Google OAuth setup (required for /admin login)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and
   create (or select) a project.
2. **APIs & Services → OAuth consent screen**: choose **External**, fill in the
   app name, and under **Test users** add every email listed in `ADMIN_EMAILS`.
   (Testing mode is fine — only test users can sign in, which matches the
   allowlist.)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000` (add your
     production origin later)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
     (and `https://<your-domain>/api/auth/callback/google` for production)
4. Copy the client ID and secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

Sign-in is additionally restricted server-side: only emails in `ADMIN_EMAILS`
pass the Auth.js `signIn` callback, and the middleware guards `/admin/**`.

## Admin dashboard

`/admin` is intentionally not linked from the public page and is excluded via
`robots.txt`. After signing in with an allowed Google account you can manage:

- **Profile** — name, headline, descriptions, contact info, avatar + CV upload
- **Skills** (grouped by category with proficiency bars)
- **Work Experience** and **Projects** (linked, with tech stack chips)
- **Education**, **Certificates & Achievements**, **Social Links**

Every save revalidates the public page, so changes appear immediately.

## Notes

- The public page statically revalidates every 60 seconds (`revalidate = 60`).
- File uploads go through `POST /api/upload` (auth-guarded, 8 MB max,
  images/PDF only) into the MinIO bucket, which the seed configures for
  anonymous read access.
- The original static template design (colors, blob hero, bottom mobile nav,
  dark mode) was ported into Tailwind design tokens in
  `src/app/globals.css`.
