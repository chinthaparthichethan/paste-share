# Paste Share

A modern, secure pastebin application built with Next.js 15 and Vercel KV for sharing code and text snippets with optional expiration and view limits.

## Features

- **Create and Share**: Generate shareable links for text and code snippets
- **Time-based Expiry**: Set automatic expiration with TTL (Time To Live)
- **View Limits**: Restrict paste access to a maximum number of views
- **Secure Storage**: Persistent storage using Vercel KV (Redis)
- **Professional UI**: Clean, modern interface with dark/light theme split design
- **Automatic Cleanup**: Pastes are automatically deleted when constraints are triggered

## Tech Stack

- **Framework**: Next.js 15 (App Router with React Server Components)
- **Runtime**: Node.js
- **Database**: Vercel KV (Redis-compatible key-value store)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript

## Persistence Layer

This application uses **Vercel KV** as its persistence layer, which is a durable Redis-compatible key-value database.

### Why Vercel KV?

- **Serverless Compatible**: Works seamlessly with serverless deployments on Vercel
- **Global Edge Network**: Low-latency access from anywhere in the world
- **Built-in TTL Support**: Native support for automatic key expiration
- **Atomic Operations**: Ensures data consistency for view count decrements
- **Persistent Storage**: Data survives across serverless function invocations

### Data Structure

Each paste is stored as a JSON object with the following structure:

{
"content": "string",
"expires_at": "timestamp or null",
"remaining_views": "number or null"
}


- Keys are stored with the pattern: `paste:{id}`
- Automatic deletion occurs when either TTL expires or view count reaches zero

## Running Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel KV database (free tier available)

### Installation Steps

1. **Clone the repository**

git clone <your-repository-url>
cd paste-share


2. **Install dependencies**

npm install


3. **Set up environment variables**

Create a `.env.local` file in the root directory:

KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token


To get these credentials:
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Create a new KV database or use existing one
- Copy the environment variables from the KV dashboard

4. **Run the development server**
npm run dev


5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Health Check
GET /api/healthz

Returns the health status of the application and database connection.

**Response:**
{
"ok": true
}

### Create Paste
POST /api/pastes


**Request Body:**
{
"content": "string (required)",
"ttl_seconds": "integer (optional, >= 1)",
"max_views": "integer (optional, >= 1)"
}

**Response:**
{
"id": "string",
"url": "https://your-app.vercel.app/p/{id}"
}

### Get Paste (API)
GET /api/pastes/{id}


**Response:**
{
"content": "string",
"remaining_views": "number or null",
"expires_at": "ISO 8601 timestamp or null"
}


**Note**: Each API fetch counts as a view and decrements `remaining_views`.

### View Paste (HTML)
    GET /p/{id}


Returns an HTML page displaying the paste content.

## Deployment

This application is deployed on Vercel.

**Live URL**: https://paste-share-l9yizgm5s-chethans-projects-3935c867.vercel.app

### Deploy Your Own

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
4. Deploy!

## Project Structure

paste-share/
├── app/
│ ├── api/
│ │ ├── healthz/
│ │ │ └── route.ts # Health check endpoint
│ │ └── pastes/
│ │ ├── route.ts # Create paste endpoint
│ │ └── [id]/
│ │ └── route.ts # Get paste endpoint
│ ├── p/
│ │ └── [id]/
│ │ └── page.tsx # Paste view page
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page (create paste UI)
│ └── globals.css # Global styles
├── lib/
│ └── kv.ts # Vercel KV client configuration
├── public/ # Static assets
├── .env.local # Environment variables (not committed)
├── package.json # Dependencies
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration
└── README.md # This file


## Design Decisions

### 1. **Serverless Architecture**
   - Built for Vercel's serverless platform
   - Stateless functions ensure scalability
   - No in-memory state that could break across invocations

### 2. **Atomic View Counting**
   - View decrements happen atomically in the database
   - Prevents race conditions under concurrent access
   - Ensures accurate view limit enforcement

### 3. **Dual Expiration Strategy**
   - Application-level TTL checking for immediate validation
   - Redis-level TTL for automatic cleanup
   - Prevents orphaned data in the database

### 4. **Split UI Design**
   - Left panel: Dark theme for code editor comfort
   - Right panel: Light theme for result clarity
   - Professional, modern aesthetic

### 5. **No Client-Side Secrets**
   - All database operations happen server-side
   - API routes handle authentication
   - Secure by default

### 6. **Error Handling**
   - All unavailable pastes return 404 (expired, deleted, or non-existent)
   - Input validation with clear error messages
   - Graceful degradation

## Testing

The application supports deterministic testing for TTL functionality:

Set `TEST_MODE=1` environment variable and include the `x-test-now-ms` header with millisecond timestamp to simulate time for expiry testing.


