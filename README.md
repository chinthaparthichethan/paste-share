# Paste Share

Paste Share is a modern, secure Pastebin-like application built with Next.js and Vercel KV.  
It allows users to create and share text or code snippets with optional time-based expiration and view limits.

---

## Features

- Create & share paste links instantly
- Time-based expiry (TTL)
- View count limits
- Persistent Redis storage
- Serverless-first architecture
- Automatic cleanup on expiry
- Safe content rendering

---

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Runtime: Node.js
- Database: Vercel KV (Redis)
- Deployment: Vercel

---

## Persistence Layer

This project uses **Vercel KV**, a Redis-compatible key-value store.

### Data Structure

Key pattern:
```
paste:{id}
```

Stored value:
```json
{
  "content": "string",
  "expires_at": "timestamp or null",
  "remaining_views": "number or null"
}
```

A paste becomes unavailable when TTL expires or views reach zero.

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm
- Vercel account (free tier)

---

### Installation

1. Clone the repository

```bash
git clone <your-repository-url>
cd paste-share
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local`

```env
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token
```

4. Run the app

```bash
npm run dev
```

Open:
```
http://localhost:3000
```

---

## API Endpoints

### Health Check

```
GET /api/healthz
```

Response:
```json
{ "ok": true }
```

---

### Create Paste

```
POST /api/pastes
```

Request:
```json
{
  "content": "string",
  "ttl_seconds": "integer (optional)",
  "max_views": "integer (optional)"
}
```

Response:
```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/{id}"
}
```

---

### Get Paste (API)

```
GET /api/pastes/{id}
```

Response:
```json
{
  "content": "string",
  "remaining_views": "number or null",
  "expires_at": "ISO timestamp or null"
}
```

---

### View Paste (HTML)

```
GET /p/{id}
```

Returns HTML page or 404 if unavailable.

---

## Deterministic Testing

Set:
```env
TEST_MODE=1
```

Header:
```
x-test-now-ms: <milliseconds since epoch>
```

---

## Deployment

Live URL:
https://paste-share-l9yizgm5s-chethans-projects-3935c867.vercel.app

Deploy steps:
1. Push to GitHub
2. Import into Vercel
3. Add env variables
4. Deploy

---

## Project Structure

```
paste-share/
├── app/
│   ├── api/
│   │   ├── healthz/route.ts
│   │   └── pastes/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── p/[id]/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/kv.ts
├── .env.local
├── package.json
└── README.md
```

---

## Design Decisions

- Serverless-safe (no in-memory state)
- Atomic view counting
- Redis TTL cleanup
- Secure server-side access
- Consistent 404 handling

---

## License

Educational / evaluation use only.
