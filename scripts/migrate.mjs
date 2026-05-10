import { readFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

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

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const pg = await import('pg')
const Pool = pg.Pool || pg.default?.Pool
const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaPath = resolve(__dirname, '..', 'db', 'schema.sql')
const schema = await readFile(schemaPath, 'utf8')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' || process.env.DATABASE_URL.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined
})

try {
  await pool.query(schema)
  console.log('Database schema applied')
} finally {
  await pool.end()
}
