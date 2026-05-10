import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { promisify } from 'node:util'

function loadEnvFile(path = '.env') {
  if (!existsSync(path)) {
    return
  }

  const env = readFileSync(path, 'utf8')
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
    if (!match || process.env[match[1]]) {
      continue
    }

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

loadEnvFile()

const scrypt = promisify(scryptCallback)
const PORT = Number(process.env.PORT || 3000)
const DATABASE_URL = process.env.DATABASE_URL
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

let pool = null

async function getPool() {
  if (!DATABASE_URL) {
    return null
  }

  if (!pool) {
    const pg = await import('pg')
    const Pool = pg.Pool || pg.default?.Pool
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSL === 'true' || DATABASE_URL.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : undefined
    })
  }

  return pool
}

const featureFlags = {
  polls: { enabled: true },
  sessionRatings: { enabled: true },
  chat: { enabled: true },
  push: { enabled: true },
  event: { opened: true }
}

const polls = [
  {
    id: 'poll-keynote',
    eventId: 'demo-event',
    question: 'Какая тема keynote была самой полезной?',
    multiple: false,
    updatedAt: new Date().toISOString(),
    options: [
      { id: 'product', text: 'Продуктовая стратегия', votes: 12 },
      { id: 'tech', text: 'Техническая архитектура', votes: 18 },
      { id: 'cases', text: 'Кейсы внедрения', votes: 9 }
    ]
  },
  {
    id: 'poll-workshops',
    eventId: 'demo-event',
    question: 'Какие воркшопы добавить в следующий раз?',
    multiple: true,
    updatedAt: new Date().toISOString(),
    options: [
      { id: 'pwa', text: 'PWA и offline-first', votes: 7 },
      { id: 'push', text: 'Push-уведомления', votes: 5 },
      { id: 'realtime', text: 'Realtime chat', votes: 11 }
    ]
  }
]

const sessions = [
  {
    id: 'session-pwa',
    eventId: 'demo-event',
    title: 'Offline-first PWA на Vue',
    speaker: 'Анна Сергеева',
    startsAt: new Date(Date.now() + 3600000).toISOString(),
    average: 4.7
  },
  {
    id: 'session-realtime',
    eventId: 'demo-event',
    title: 'WebSocket-подписки без потерь',
    speaker: 'Илья Морозов',
    startsAt: new Date(Date.now() + 7200000).toISOString(),
    average: 4.5
  }
]

const rooms = [
  { id: 'general', eventId: 'demo-event', title: 'Общий чат', unreadCount: 0 },
  { id: 'qa', eventId: 'demo-event', title: 'Вопросы спикерам', unreadCount: 2 }
]

const sockets = new Set()

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-App-Version',
    'Content-Type': 'application/json; charset=utf-8'
  })
  response.end(status === 204 ? undefined : JSON.stringify(payload))
}

function sendError(response, status, message, details) {
  sendJson(response, status, { message, ...(details ? { details } : {}) })
}

function sendHtml(request, response, status, html) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html; charset=utf-8'
  })
  response.end(request.method === 'HEAD' ? undefined : html)
}

async function sendIndexPage(request, response) {
  const db = await getPool()
  sendHtml(request, response, 200, `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Event Platform API</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Segoe UI, Arial, sans-serif;
        color: #172033;
        background: #f5f7fb;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 32px;
      }
      main {
        width: min(920px, 100%);
        background: #fff;
        border: 1px solid #d9e1ef;
        border-radius: 8px;
        padding: 28px;
        box-shadow: 0 18px 48px rgba(20, 30, 50, .1);
      }
      h1 {
        margin: 0 0 8px;
        font-size: 32px;
      }
      p {
        margin: 0 0 18px;
        color: #526174;
      }
      .status {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
        margin: 20px 0;
      }
      .item {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px;
      }
      .label {
        display: block;
        color: #64748b;
        font-size: 13px;
        margin-bottom: 6px;
      }
      .ok {
        color: #0f766e;
        font-weight: 700;
      }
      code {
        background: #eef2f7;
        border-radius: 6px;
        padding: 2px 6px;
      }
      ul {
        margin: 8px 0 0;
        padding-left: 20px;
      }
      li {
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Event Platform API</h1>
      <p>Это backend для приложения событий. Quasar frontend запускается отдельно через <code>npm run dev</code>.</p>
      <section class="status">
        <div class="item">
          <span class="label">API</span>
          <span class="ok">работает</span>
        </div>
        <div class="item">
          <span class="label">PostgreSQL</span>
          <span class="ok">${db ? 'подключен' : 'не настроен'}</span>
        </div>
        <div class="item">
          <span class="label">WebSocket</span>
          <span class="ok">ws://localhost:${PORT}/chat</span>
        </div>
      </section>
      <p>Полезные endpoints:</p>
      <ul>
        <li><code>GET /health</code> - проверка API и базы</li>
        <li><code>POST /auth/register</code> - регистрация пользователя</li>
        <li><code>POST /auth/login</code> - вход пользователя</li>
        <li><code>GET /features?eventId=demo-event</code> - feature flags</li>
        <li><code>GET /events/demo-event/polls</code> - опросы</li>
        <li><code>GET /events/demo-event/chat/rooms</code> - комнаты чата</li>
      </ul>
    </main>
  </body>
</html>`)
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    request.on('error', reject)
  })
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizePhone(phone) {
  const value = String(phone || '').trim()
  return value.length > 0 ? value : null
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  return `${salt}:${hash.toString('hex')}`
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':')
  const hash = await scrypt(password, salt, 64)
  const stored = Buffer.from(key, 'hex')
  return stored.length === hash.length && timingSafeEqual(stored, hash)
}

function makeToken(user) {
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000)
  })).toString('base64url')
  const signature = createHash('sha256')
    .update(`${payload}:${process.env.AUTH_TOKEN_SECRET || 'dev-secret'}`)
    .digest('base64url')

  return `${payload}.${signature}`
}

async function registerUser(body) {
  const email = normalizeEmail(body.email)
  const password = String(body.password || '')
  const name = String(body.name || '').trim()
  const phone = normalizePhone(body.phone)

  if (!email || !email.includes('@')) {
    return { status: 400, payload: { message: 'Email is required' } }
  }

  if (password.length < 6) {
    return { status: 400, payload: { message: 'Password must be at least 6 characters' } }
  }

  if (!name) {
    return { status: 400, payload: { message: 'Name is required' } }
  }

  const db = await getPool()
  if (!db) {
    return {
      status: 503,
      payload: { message: 'DATABASE_URL is not configured' }
    }
  }

  const passwordHash = await hashPassword(password)

  try {
    const result = await db.query(
      `insert into users (email, password_hash, name, phone)
       values ($1, $2, $3, $4)
       returning id, email, name, phone, created_at`,
      [email, passwordHash, name, phone]
    )
    const user = result.rows[0]

    return {
      status: 201,
      payload: {
        user,
        token: makeToken(user)
      }
    }
  } catch (error) {
    if (error?.code === '23505') {
      return { status: 409, payload: { message: 'User already exists' } }
    }

    throw error
  }
}

async function loginUser(body) {
  const email = normalizeEmail(body.email)
  const password = String(body.password || '')
  const db = await getPool()

  if (!db) {
    return { status: 503, payload: { message: 'DATABASE_URL is not configured' } }
  }

  const result = await db.query(
    'select id, email, password_hash, name, phone, created_at from users where email = $1',
    [email]
  )
  const user = result.rows[0]

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { status: 401, payload: { message: 'Invalid email or password' } }
  }

  delete user.password_hash

  return {
    status: 200,
    payload: {
      user,
      token: makeToken(user)
    }
  }
}

function writeFrame(socket, payload) {
  const body = Buffer.from(JSON.stringify(payload))
  const header = body.length < 126
    ? Buffer.from([0x81, body.length])
    : Buffer.from([0x81, 126, body.length >> 8, body.length & 0xff])

  socket.write(Buffer.concat([header, body]))
}

function readFrame(buffer) {
  const length = buffer[1] & 0x7f
  const maskOffset = length === 126 ? 4 : 2
  const payloadLength = length === 126 ? buffer.readUInt16BE(2) : length
  const mask = buffer.subarray(maskOffset, maskOffset + 4)
  const payload = buffer.subarray(maskOffset + 4, maskOffset + 4 + payloadLength)

  for (let index = 0; index < payload.length; index += 1) {
    payload[index] ^= mask[index % 4]
  }

  return JSON.parse(payload.toString('utf8'))
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`)

    if (request.method === 'OPTIONS') {
      sendJson(response, 204, {})
      return
    }

    if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname === '/') {
      await sendIndexPage(request, response)
      return
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      const db = await getPool()
      sendJson(response, 200, { ok: true, database: db ? 'configured' : 'not_configured' })
      return
    }

    if (request.method === 'POST' && url.pathname === '/auth/register') {
      const result = await registerUser(await readBody(request))
      sendJson(response, result.status, result.payload)
      return
    }

    if (request.method === 'POST' && url.pathname === '/auth/login') {
      const result = await loginUser(await readBody(request))
      sendJson(response, result.status, result.payload)
      return
    }

    if (request.method === 'GET' && url.pathname === '/features') {
      sendJson(response, 200, featureFlags)
      return
    }

    const pollsMatch = url.pathname.match(/^\/events\/([^/]+)\/polls$/)
    if (request.method === 'GET' && pollsMatch) {
      sendJson(response, 200, polls.filter((poll) => poll.eventId === pollsMatch[1]))
      return
    }

    const pollAnswerMatch = url.pathname.match(/^\/events\/([^/]+)\/polls\/([^/]+)\/answers$/)
    if (request.method === 'POST' && pollAnswerMatch) {
      const body = await readBody(request)
      const poll = polls.find((item) => item.id === pollAnswerMatch[2])
      if (poll) {
        poll.answeredOptionIds = body.optionIds
      }
      sendJson(response, 200, { ok: true })
      return
    }

    const ratingSessionsMatch = url.pathname.match(/^\/events\/([^/]+)\/ratings\/sessions$/)
    if (request.method === 'GET' && ratingSessionsMatch) {
      sendJson(response, 200, sessions.filter((session) => session.eventId === ratingSessionsMatch[1]))
      return
    }

    const ratingMatch = url.pathname.match(/^\/events\/([^/]+)\/ratings\/([^/]+)$/)
    if (request.method === 'POST' && ratingMatch) {
      const body = await readBody(request)
      const session = sessions.find((item) => item.id === ratingMatch[2])
      if (session) {
        session.myRating = body.score
        session.myFeedback = body.feedback
      }
      sendJson(response, 200, { ok: true })
      return
    }

    const roomsMatch = url.pathname.match(/^\/events\/([^/]+)\/chat\/rooms$/)
    if (request.method === 'GET' && roomsMatch) {
      sendJson(response, 200, rooms.filter((room) => room.eventId === roomsMatch[1]))
      return
    }

    if (request.method === 'POST' && url.pathname === '/push/register') {
      await readBody(request)
      sendJson(response, 200, { ok: true })
      return
    }

    sendJson(response, 404, { message: 'Not found' })
  } catch (error) {
    sendError(response, 500, error instanceof Error ? error.message : 'Internal server error')
  }
})

server.on('upgrade', (request, socket) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`)
  if (url.pathname !== '/chat') {
    socket.destroy()
    return
  }

  const accept = createHash('sha1')
    .update(`${request.headers['sec-websocket-key']}${WS_GUID}`)
    .digest('base64')

  socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${accept}`,
    '',
    ''
  ].join('\r\n'))

  sockets.add(socket)
  writeFrame(socket, {
    type: 'message',
    roomId: 'general',
    messageId: `srv_${Date.now()}`,
    data: {
      id: `srv_${Date.now()}`,
      roomId: 'general',
      authorId: 'system',
      authorName: 'Event Bot',
      text: 'Добро пожаловать в чат события.',
      createdAt: new Date().toISOString()
    }
  })

  socket.on('data', (buffer) => {
    try {
      const packet = readFrame(buffer)
      if (packet.type === 'message') {
        const message = {
          type: 'message',
          roomId: packet.roomId,
          messageId: packet.messageId,
          data: {
            id: packet.messageId,
            roomId: packet.roomId,
            authorId: 'me',
            authorName: 'Вы',
            text: packet.data.text,
            createdAt: new Date().toISOString()
          }
        }
        sockets.forEach((client) => writeFrame(client, message))
      }
    } catch (error) {
      writeFrame(socket, {
        type: 'error',
        data: { message: error instanceof Error ? error.message : 'Bad websocket frame' }
      })
    }
  })

  socket.on('close', () => sockets.delete(socket))
  socket.on('error', () => sockets.delete(socket))
})

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
  console.log(`Chat listening on ws://localhost:${PORT}/chat`)
  console.log(DATABASE_URL ? 'PostgreSQL is configured' : 'PostgreSQL is not configured; set DATABASE_URL')
})
