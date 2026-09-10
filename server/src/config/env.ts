import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// ─── Smart Environment Loading ────────────────────────────────────────────────
// Determine environment mode (production vs development/test)
const rawNodeEnv = (process.env.NODE_ENV || '').trim().toLowerCase();
const isProdRequested = rawNodeEnv === 'production' || rawNodeEnv === 'producation';

const serverRoot = path.resolve(__dirname, '../../');

// In production mode, look for .env.prod first, then .env.production, then .env
// In local/development mode, look for .env.local first, then .env.development, then .env
const envCandidateFiles = isProdRequested
  ? ['.env.prod', '.env.production', '.env']
  : ['.env.local', '.env.development', '.env'];

let loadedEnvFile: string | null = null;
for (const candidate of envCandidateFiles) {
  const fullPath = path.join(serverRoot, candidate);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    loadedEnvFile = candidate;
    break;
  }
}

if (loadedEnvFile) {
  console.log(`[Config] Loaded environment variables from: ${loadedEnvFile} (Mode: ${process.env.NODE_ENV || (isProdRequested ? 'production' : 'development')})`);
} else {
  dotenv.config({ path: path.join(serverRoot, '.env') });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalEnvNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${raw}`);
  }
  return parsed;
}

// ─── Config Object ────────────────────────────────────────────────────────────

const activeEnv = (optionalEnv('NODE_ENV', 'development')).toLowerCase();
const isProduction = activeEnv === 'production' || activeEnv === 'producation';

const config = {
  app: {
    nodeEnv: isProduction ? 'production' : activeEnv,
    port: optionalEnvNumber('PORT', 5000),
    frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:5173'),
    isDevelopment: !isProduction && activeEnv !== 'test',
    isProduction,
    isTest: activeEnv === 'test',
  },

  database: {
    url: requireEnv('DATABASE_URL'),
  },

  cors: {
    allowedOrigins: Array.from(
      new Set([
        ...optionalEnv(
          'ALLOWED_ORIGINS',
          'http://localhost:5173,http://localhost:3000'
        )
          .split(',')
          .map((o) => o.trim().replace(/\/+$/, ''))
          .filter(Boolean),
        optionalEnv('FRONTEND_URL', 'http://localhost:5173').trim().replace(/\/+$/, ''),
      ])
    ).filter(Boolean),
  },

  rateLimit: {
    windowMs: optionalEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 min
    max: optionalEnvNumber('RATE_LIMIT_MAX', 100),
  },

  jwt: {
    secret: optionalEnv('JWT_SECRET', 'default-globetrotter-super-secret-jwt-key'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  },
} as const;

export default config;
export type AppConfig = typeof config;
