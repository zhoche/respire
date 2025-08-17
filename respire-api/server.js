// Imports et configuration
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const app = express();
const prisma = new PrismaClient();

// ----- CONFIG -----
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const PORT = parseInt(process.env.PORT || '5050', 10);
const HOST = '0.0.0.0';

// ----- MIDDLEWARES -----
app.use(cors({
  origin: ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ----- HELPERS -----
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');

// ----- ANTI-SPAM (Redis) -----
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: 1,
  enableReadyCheck: false,
});
redis.on('error', (e) => console.warn('Redis error:', e.message));

const perMinute = new RateLimiterRedis({
  storeClient: redis, keyPrefix: 'rl:m', points: 3, duration: 60, blockDuration: 60,
});
const perDay = new RateLimiterRedis({
  storeClient: redis, keyPrefix: 'rl:d', points: 10, duration: 86400, blockDuration: 3600,
});

async function rateLimit(req, res, next) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  try {
    await Promise.all([perMinute.consume(key), perDay.consume(key)]);
    next();
  } catch {
    res.status(429).json({ error: 'too_many_requests', message: 'Trop de requêtes, réessaie plus tard.' });
  }
}

// ----- ROUTES -----
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (_, res) => res.send('API Respire is running 🚀'));

app.post('/api/contact', rateLimit, async (req, res) => {
  const { firstname, lastname, email, phone, offer, message } = req.body || {};
  const errors = {};
  if (!firstname || firstname.trim().length < 2) errors.firstname = 'Prénom requis (≥ 2).';
  if (!lastname  || lastname.trim().length  < 2) errors.lastname  = 'Nom requis (≥ 2).';
  if (!email || !isEmail(email))                 errors.email     = 'Email invalide.';
  if (!message || message.trim().length < 10)   errors.message   = 'Message requis (≥ 10).';

  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    await prisma.contactMessage.create({
      data: {
        firstname: firstname.trim(),
        lastname : lastname.trim(),
        email    : email.trim().toLowerCase(),
        phone    : (phone || '').trim() || null,
        offer    : offer || null,
        message  : message.trim(),
      }
    });
    return res.status(200).json({ ok: true, message: 'Votre message a bien été reçu.' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ ok: false, message: 'Erreur serveur.' });
  }
});

// ----- START -----
app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://127.0.0.1:${PORT}`);
});

// Shutdown propre
process.on('SIGINT', async () => { try { await prisma.$disconnect(); await redis.quit(); } finally { process.exit(0); }});
process.on('SIGTERM', async () => { try { await prisma.$disconnect(); await redis.quit(); } finally { process.exit(0); }});
