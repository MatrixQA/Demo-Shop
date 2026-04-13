const USERS_KEY = 'demoShop.users.v1'
const VERIFY_TOKENS_KEY = 'demoShop.verifyTokens.v1'
const RESET_TOKENS_KEY = 'demoShop.resetTokens.v1'

function nowMs() {
  return Date.now()
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function ensureSeeded() {
  const existing = readJson(USERS_KEY, null)
  if (Array.isArray(existing) && existing.length) return

  writeJson(USERS_KEY, [
    {
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      emailVerified: true,
      createdAt: nowMs(),
      updatedAt: nowMs(),
    },
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      emailVerified: true,
      createdAt: nowMs(),
      updatedAt: nowMs(),
    },
  ])
}

function loadUsers() {
  ensureSeeded()
  const users = readJson(USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

function saveUsers(users) {
  writeJson(USERS_KEY, users)
}

function loadVerifyTokens() {
  const tokens = readJson(VERIFY_TOKENS_KEY, [])
  return Array.isArray(tokens) ? tokens : []
}

function saveVerifyTokens(tokens) {
  writeJson(VERIFY_TOKENS_KEY, tokens)
}

function loadResetTokens() {
  const tokens = readJson(RESET_TOKENS_KEY, [])
  return Array.isArray(tokens) ? tokens : []
}

function saveResetTokens(tokens) {
  writeJson(RESET_TOKENS_KEY, tokens)
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function authenticate(username, password) {
  const users = loadUsers()
  const u = users.find((x) => x.username === username)
  if (!u || u.password !== password) return { ok: false, error: 'Invalid credentials' }
  if (!u.emailVerified) return { ok: false, error: 'Please verify your email first.' }
  return { ok: true, user: { username: u.username, role: u.role } }
}

export function register({ username, email, password }) {
  const users = loadUsers()

  const uname = String(username || '').trim()
  const mail = normalizeEmail(email)
  const pass = String(password || '')

  if (!uname || !mail || !pass) return { ok: false, error: 'All fields are required.' }
  if (uname.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' }
  if (!mail.includes('@')) return { ok: false, error: 'Please enter a valid email address.' }
  if (pass.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

  if (users.some((u) => u.username === uname))
    return { ok: false, error: 'Username is already taken.' }
  if (users.some((u) => normalizeEmail(u.email) === mail))
    return { ok: false, error: 'Email is already in use.' }

  const createdAt = nowMs()
  const newUser = {
    username: uname,
    email: mail,
    password: pass,
    role: 'user',
    emailVerified: false,
    createdAt,
    updatedAt: createdAt,
  }

  saveUsers([newUser, ...users])

  const token = crypto.randomUUID()
  const expiresAt = nowMs() + 1000 * 60 * 60 * 24 // 24h
  const tokens = loadVerifyTokens().filter((t) => t.username !== uname)
  tokens.unshift({ token, username: uname, email: mail, expiresAt, usedAt: null })
  saveVerifyTokens(tokens)

  return { ok: true, token }
}

export function verifyEmail(token) {
  const t = String(token || '')
  if (!t) return { ok: false, error: 'Missing token.' }

  const tokens = loadVerifyTokens()
  const rec = tokens.find((x) => x.token === t)
  if (!rec) return { ok: false, error: 'Invalid or expired verification link.' }
  if (rec.usedAt) return { ok: false, error: 'This verification link was already used.' }
  if (rec.expiresAt < nowMs()) return { ok: false, error: 'Invalid or expired verification link.' }

  const users = loadUsers()
  const idx = users.findIndex((u) => u.username === rec.username)
  if (idx === -1) return { ok: false, error: 'Account no longer exists.' }

  users[idx] = { ...users[idx], emailVerified: true, updatedAt: nowMs() }
  saveUsers(users)

  const updatedTokens = tokens.map((x) => (x.token === t ? { ...x, usedAt: nowMs() } : x))
  saveVerifyTokens(updatedTokens)

  return { ok: true, username: rec.username }
}

export function requestPasswordReset(email) {
  const mail = normalizeEmail(email)
  if (!mail) return { ok: false, error: 'Email is required.' }

  const users = loadUsers()
  const u = users.find((x) => normalizeEmail(x.email) === mail)

  // Always return ok to avoid account enumeration.
  if (!u) return { ok: true, token: null }

  const token = crypto.randomUUID()
  const expiresAt = nowMs() + 1000 * 60 * 30 // 30m
  const tokens = loadResetTokens().filter((t) => t.username !== u.username)
  tokens.unshift({ token, username: u.username, email: mail, expiresAt, usedAt: null })
  saveResetTokens(tokens)

  return { ok: true, token }
}

export function resetPassword({ token, newPassword }) {
  const t = String(token || '')
  const pass = String(newPassword || '')
  if (!t) return { ok: false, error: 'Missing token.' }
  if (pass.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

  const tokens = loadResetTokens()
  const rec = tokens.find((x) => x.token === t)
  if (!rec) return { ok: false, error: 'Invalid or expired reset link.' }
  if (rec.usedAt) return { ok: false, error: 'This reset link was already used.' }
  if (rec.expiresAt < nowMs()) return { ok: false, error: 'Invalid or expired reset link.' }

  const users = loadUsers()
  const idx = users.findIndex((u) => u.username === rec.username)
  if (idx === -1) return { ok: false, error: 'Account no longer exists.' }

  users[idx] = { ...users[idx], password: pass, updatedAt: nowMs() }
  saveUsers(users)

  const updatedTokens = tokens.map((x) => (x.token === t ? { ...x, usedAt: nowMs() } : x))
  saveResetTokens(updatedTokens)

  return { ok: true }
}

export function getLastVerifyTokenFor(username) {
  const u = String(username || '').trim()
  if (!u) return null
  const tokens = loadVerifyTokens().filter((t) => t.username === u)
  return tokens[0]?.token ?? null
}

export function getLastResetTokenForEmail(email) {
  const mail = normalizeEmail(email)
  if (!mail) return null
  const tokens = loadResetTokens().filter((t) => normalizeEmail(t.email) === mail)
  return tokens[0]?.token ?? null
}

