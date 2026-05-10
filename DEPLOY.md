# Deploy: Supabase + Render

## 1. Supabase

1. Open Supabase project.
2. Go to SQL Editor.
3. Run `db/supabase.sql`.
4. Copy the project database connection string.

Use the pooled/session connection string from Supabase and replace the password placeholder with your database password.

## 2. Render

Create a Web Service from GitHub.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables:

```env
DATABASE_URL=postgresql://...
PGSSL=true
AUTH_TOKEN_SECRET=make-a-long-random-string
NODE_ENV=production
```

After deploy, check:

```text
https://your-render-service.onrender.com/health
```

Expected:

```json
{"ok":true,"database":"configured"}
```

## 3. APK

To make the APK work for everyone, rebuild it with:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
VITE_WS_URL=wss://your-render-service.onrender.com
```

The old APK that points to localhost will not automatically know the Render URL.
