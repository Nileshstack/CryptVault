# Mini Vault (Next.js)

Simple privacy-first password vault built with Next.js (app router) and MongoDB.

Features implemented:
- Register / Login (email + password)
- Password generator (length slider, toggles)
- Vault items saved encrypted on client using AES (crypto-js) — server stores only ciphertext
- View / delete items
- Copy to clipboard with auto-clear (15s)
- Basic search

How to run

1. install deps

```powershell
npm install
```

2. start dev server

```powershell
npm run dev
```

3. set up MongoDB

By default it will try mongodb://127.0.0.1:27017 and database `madquick`. To change, set `MONGODB_URI` and `MONGODB_DB` in your environment.

Notes
- This is intentionally simple: client-side encryption uses a passphrase prompted at save/decrypt time. The passphrase is never sent to the server.
- For production replace the simple JWT secret and improve auth cookies/CSRF protections.
- Nice-to-haves not implemented: TOTP 2FA, tags, export/import.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
