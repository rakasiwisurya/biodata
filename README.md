# Rakasiwi Surya — Portfolio & Biodata (Firebase)

Personal portfolio with a hidden admin dashboard and a print-ready ATS CV,
built as a **static Next.js app on the Firebase free (Spark) plan**.

| Route    | Purpose                                                              |
| -------- | ------------------------------------------------------------------- |
| `/`      | Public portfolio for HR / recruiters (reads Firestore, CV defaults) |
| `/cv`    | Print-ready, ATS-friendly CV (browser → Print → Save as PDF)        |
| `/admin` | Hidden dashboard (Google sign-in) to edit all content, no code      |

## Tech stack

- **Next.js 15** (App Router, **static export**) + TypeScript + Tailwind CSS v4
- **Firebase Hosting** (static, free Spark plan — no billing, no credit card)
- **Cloud Firestore** for content (client SDK, public read, admin write)
- **Firebase Auth** (Google) gating `/admin`
- No Cloud Storage: the CV PDF and avatar are bundled static files; project
  images are added by pasting an image URL.

The public page renders the bundled CV **defaults instantly** (so HR always
sees a full CV, even before any Firestore data or with JS disabled), then
live-overrides from Firestore once it loads.

## Local development

```bash
npm install
# copy .env.example -> .env.local and fill in your Firebase web config
npm run dev          # http://localhost:3000
```

Without Firebase config the site still runs and shows the bundled CV; the
admin dashboard shows a "configure Firebase" notice.

## One-time Firebase setup

1. **Create a project** at <https://console.firebase.google.com> (Spark plan,
   no upgrade needed).
2. **Add a Web app** (Project settings → General → Your apps → `</>`). Copy the
   config values into `.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
3. **Enable Firestore**: Build → Firestore Database → Create database →
   **Production mode** → pick a location.
4. **Enable Google sign-in**: Build → Authentication → Get started → Sign-in
   method → **Google** → Enable.
5. **Authorized domains** (Authentication → Settings → Authorized domains):
   `localhost` is there by default; after deploying, add
   `YOUR_PROJECT_ID.web.app` (and any custom domain).
6. **Admin allowlist**: edit the email list in **both** `firestore.rules`
   (the real security gate) and `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local`.
7. Put your project id in **`.firebaserc`** (replace `YOUR_FIREBASE_PROJECT_ID`)
   or run `npx firebase use --add`.

## Deploy

```bash
npx firebase login                 # one time
npm run deploy:rules               # publish Firestore security rules
npm run deploy:hosting             # build static export + deploy hosting
# or: npm run deploy                # rules + hosting together
```

`npm run build` produces the static site in `out/`, which `firebase.json`
serves as Hosting `public`.

## First run after deploy

1. Open `https://YOUR_PROJECT_ID.web.app` — the public CV shows immediately
   from the bundled defaults.
2. Go to `/admin`, sign in with an allowlisted Google account.
3. Click **Import starter CV data** on the dashboard — this copies the bundled
   CV into Firestore so every field becomes editable. (Skipped automatically
   for any collection that already has data.)
4. Edit anything; changes are saved to Firestore and appear on `/` on reload.

## Notes & gotchas

- **Firestore rules are the real security boundary.** The
  `NEXT_PUBLIC_ADMIN_EMAILS` check only controls the admin UI.
- Replacing the CV PDF: drop a new file in `public/cv/` (keep the path) or set a
  CV URL in the admin Profile form. The avatar works the same way
  (`public/avatar-placeholder.svg` or a pasted URL).
- Static export uses query-param routing for admin edits
  (`/admin/skills/edit?id=…`) because Hosting can't server-render path params.
- If you later want real file uploads or Next.js SSR, that requires the Blaze
  plan (still $0 under free quotas, but needs a card) + Firebase App Hosting or
  Cloud Storage.
