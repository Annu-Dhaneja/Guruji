'use strict';
/**
 * GuruCraftPro — Owner-only Admin Auth (server-side).
 * Exactly ONE admin identity = OWNER_EMAIL (env). Nobody else can ever be admin.
 * Gates: owner email + password + 16-digit email OTP + server-side owner check + live server session.
 */
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const DENY_MSG = 'Access denied. This account is not authorized as the GuruCraftPro Owner.';
const OTP_TTL_MS = 5 * 60 * 1000, MAX_ATTEMPTS = 5, SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const COOKIE = 'gcp_admin';
const eq = (a, b) => { // constant-time string compare
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

function createAdminAuth({ sendMail, env = process.env, isProd = env.NODE_ENV === 'production' } = {}) {
  const OWNER_EMAIL = String(env.OWNER_EMAIL || '').trim().toLowerCase();   // server-side allowlist
  const HASH = env.OWNER_PASSWORD_HASH;                                      // bcrypt hash, never plaintext
  const SECRET = env.ADMIN_JWT_SECRET;
  if (!OWNER_EMAIL || !HASH || !SECRET || SECRET.length < 32) throw new Error('Set OWNER_EMAIL, OWNER_PASSWORD_HASH, ADMIN_JWT_SECRET (>=32 chars)');
  if (typeof sendMail !== 'function') throw new Error('sendMail(to, subject, text) required');

  const challenges = new Map(); // id -> {otpHash, exp, tries}   (use Redis if you run >1 server instance)
  const sessions = new Map();   // sid -> {exp}                   (server-side session = revocable)
  const hits = new Map();
  const DUMMY = bcrypt.hashSync('x', 10);
  const hmac = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');

  const limiter = (max, winMs) => (req, res, next) => {
    const k = req.path + '|' + req.ip, now = Date.now();
    const h = (hits.get(k) || []).filter(t => now - t < winMs);
    if (h.length >= max) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
    h.push(now); hits.set(k, h); next();
  };

  // ---- Middleware: the ONLY thing that grants admin ----
  function requireOwner(req, res, next) {
    const page = !req.originalUrl.startsWith('/api/');
    const fail = (code, msg) => page ? res.redirect(code === 403 ? '/?denied=owner' : '/admin-login.html')
                                     : res.status(code).json({ error: msg });
    const token = req.cookies && req.cookies[COOKIE];
    if (!token) {
      // logged in as a normal user (any non-admin session) => explicit denial
      if (req.cookies && (req.cookies.gcp_token || req.headers.authorization)) return fail(403, DENY_MSG);
      return fail(401, 'Authentication required.');
    }
    let p; try { p = jwt.verify(token, SECRET, { algorithms: ['HS256'] }); } catch { return fail(401, 'Session invalid or expired.'); }
    const s = sessions.get(p.sid);
    if (!s || s.exp < Date.now()) return fail(401, 'Session expired.');
    // Role is NEVER read from the token/browser: re-verified against server allowlist on every request.
    if (!p.sub || !eq(String(p.sub).toLowerCase(), OWNER_EMAIL)) return fail(403, DENY_MSG);
    req.owner = { email: OWNER_EMAIL, sid: p.sid };
    next();
  }

  const router = express.Router();
  router.use(express.json({ limit: '2kb' }));

  // Step 1: email + password -> emails 16-digit OTP (to OWNER_EMAIL only)
  router.post('/login', limiter(5, 15 * 60 * 1000), async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase(), pw = String(req.body.password || '');
    const okEmail = eq(email, OWNER_EMAIL);
    const okPw = await bcrypt.compare(pw, okEmail ? HASH : DUMMY); // same timing either way
    if (!(okEmail && okPw)) return res.status(401).json({ error: 'Invalid credentials.' });
    const otp = Array.from({ length: 16 }, () => crypto.randomInt(0, 10)).join('');
    const id = crypto.randomBytes(24).toString('hex');
    challenges.set(id, { otpHash: hmac(id + otp), exp: Date.now() + OTP_TTL_MS, tries: 0 });
    try { await sendMail(OWNER_EMAIL, 'GuruCraftPro Admin OTP', `Your 16-digit admin OTP: ${otp}\nValid for 5 minutes. If this was not you, change your password.`); }
    catch (e) { challenges.delete(id); return res.status(502).json({ error: 'Could not send OTP email. Check mail settings.' }); }
    res.json({ challengeId: id, expiresInSec: OTP_TTL_MS / 1000 });
  });

  // Step 2: OTP -> session cookie
  router.post('/verify-otp', limiter(10, 15 * 60 * 1000), (req, res) => {
    const id = String(req.body.challengeId || ''), otp = String(req.body.otp || '').replace(/\D/g, '');
    const c = challenges.get(id);
    if (!c || c.exp < Date.now()) { challenges.delete(id); return res.status(401).json({ error: 'OTP expired. Sign in again.' }); }
    if (++c.tries > MAX_ATTEMPTS) { challenges.delete(id); return res.status(429).json({ error: 'Too many wrong OTPs. Sign in again.' }); }
    if (otp.length !== 16 || !eq(hmac(id + otp), c.otpHash)) return res.status(401).json({ error: 'Incorrect OTP.' });
    challenges.delete(id); // single use
    const sid = crypto.randomBytes(24).toString('hex');
    sessions.set(sid, { exp: Date.now() + SESSION_TTL_MS });
    const token = jwt.sign({ sub: OWNER_EMAIL, sid }, SECRET, { algorithm: 'HS256', expiresIn: SESSION_TTL_MS / 1000 });
    res.cookie(COOKIE, token, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: SESSION_TTL_MS, path: '/' });
    res.json({ ok: true, redirect: '/admin/dashboard' });
  });

  router.get('/me', requireOwner, (req, res) => res.json({ owner: true, email: req.owner.email }));
  router.post('/logout', (req, res) => {
    try { sessions.delete(jwt.decode(req.cookies[COOKIE]).sid); } catch {}
    res.clearCookie(COOKIE, { path: '/' }); res.json({ ok: true });
  });

  return { router, requireOwner, DENY_MSG };
}

/** Mount helper. Everything under /admin and /api/admin (except auth routes) is owner-only. */
function mountAdmin(app, opts) {
  const a = createAdminAuth(opts);
  app.use(cookieParser());
  app.use('/api/admin/auth', a.router);
  app.use('/api/admin', a.requireOwner);                 // all admin APIs: products, orders, users, settings, cms, security
  app.use(/^\/admin(\/.*)?$/, a.requireOwner);           // /admin, /admin/dashboard, /admin/products ... pages
  return a;
}
module.exports = { createAdminAuth, mountAdmin, DENY_MSG };
