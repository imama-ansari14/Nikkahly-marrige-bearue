# Nikkahly Marriage Bureau — Private Client Manager

This version uses **MongoDB Atlas + Express + React + Tailwind CSS**.

It is designed as a private internal system, not a public marketing website.

## Why MongoDB?

MongoDB Atlas currently offers a Free cluster that does not expire. The free cluster has 512 MB storage, shared resources and operational limits. For this small private bureau system, it is a reasonable starting point.

The app stores:
- Client profile data in MongoDB
- Client photos in MongoDB GridFS

This means there is no separate image-storage service required.

## Features

- Private single-admin login
- Dashboard
- Add/edit/delete clients
- Male/Female field
- Male/Female/All filters on the client list
- Search clients
- Full dedicated client detail page
- Multiple photos per client
- Photos shown on client detail page
- Delete individual photos
- Responsive mobile/tablet/desktop UI
- Nikkahly logo-inspired wine/burgundy + gold theme
- MongoDB Atlas database
- MongoDB GridFS for images
- JWT authentication
- No SEO/public-facing marketing pages

## 1. MongoDB Atlas

Create an Atlas account and a Free cluster.

MongoDB calls this the **Free cluster** (formerly M0). According to MongoDB's current documentation, Free clusters never expire and include 512 MB of storage.

Create:
1. Atlas project
2. Free cluster
3. Database user
4. Network access rule

For development, you can temporarily allow your current IP.

Then copy the connection string.

Example:

`mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/nikkahly`

## 2. Configure backend

Copy:

`server/.env.example`

to:

`server/.env`

Set:

`MONGODB_URI=...`
`JWT_SECRET=...`
`ADMIN_EMAIL=...`
`ADMIN_PASSWORD=...`

The admin email/password is the only application login.

**Never commit `.env` to GitHub.**

## 3. Install

From the project root:

```bash
npm install
npm install --workspace client
npm install --workspace server
```

Then:

```bash
npm run dev
```

Frontend:
`http://localhost:5173`

Backend:
`http://localhost:5000`

## 4. How the database is structured

MongoDB database:

`nikkahly`

Collection:

`clients`

Each client document contains the fields from the original WhatsApp form plus:

`gender`

Images are stored using MongoDB GridFS in:

`clientImages.files`
`clientImages.chunks`

Each image has the client's MongoDB `_id` in its metadata.

## 5. About the login

Yes — I recommend keeping the private login even though your mum is the only person using the website.

The reason is not because she needs multiple staff accounts.

The database contains highly sensitive personal information:
- Names
- Addresses
- Family details
- Salaries
- Marriage preferences
- Personal photographs

If the website has no login, anyone who discovers the URL could potentially access the records.

The login here is intentionally simple: one admin account, no public registration and no unnecessary user-management system.

## 6. Deploying it

This project has two parts:

- React frontend
- Node/Express backend

You need hosting that can run the Node backend. A normal static-only frontend host is not enough for the API unless you convert the backend to serverless functions.

A simple deployment setup is:

- Frontend: Vercel / Netlify
- Backend: Render / Railway / another Node-compatible host
- Database: MongoDB Atlas

After deploying the backend, set:

`VITE_API_URL=https://YOUR-BACKEND/api`

`VITE_API_BASE_URL=https://YOUR-BACKEND`

And backend:

`CLIENT_ORIGIN=https://YOUR-FRONTEND`

## Important storage consideration

MongoDB Atlas Free has 512 MB storage. Because client photos are stored in MongoDB GridFS, photos will consume that same quota.

For a small number of compressed client photos, this can work.

However, if your mum eventually stores hundreds/thousands of high-resolution photos, 512 MB will become the limiting factor. At that point you should either:
- upgrade MongoDB, or
- move images to a dedicated object-storage service while keeping profile data in MongoDB.

## Recommended image practice

Ask your mum to upload normal phone photos rather than original DSLR files.

The backend currently limits each uploaded image to 8 MB and allows up to 12 images in one upload.

## Security note

The image endpoint requires the JWT, so photos are not public URLs. This is intentionally different from the previous Supabase version.

For a production deployment, also use HTTPS and a strong random JWT secret.
