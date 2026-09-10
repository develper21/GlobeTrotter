const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = (process.env.NODE_ENV || '').trim().toLowerCase() === 'production';

let hasTsNodeDev = false;
try {
  require.resolve('ts-node-dev');
  hasTsNodeDev = true;
} catch {
  hasTsNodeDev = false;
}

if (!isProduction && hasTsNodeDev) {
  // Local development mode: run ts-node-dev
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const child = spawn(
    npxCmd,
    ['ts-node-dev', '--respawn', '--transpile-only', 'src/server.ts'],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    }
  );

  const forwardSignal = (sig) => {
    if (child && !child.killed) child.kill(sig);
  };
  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGTERM', () => forwardSignal('SIGTERM'));

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} else {
  // Production fallback: compiled production server
  console.log(
    '[Runner] Production mode or missing devDependencies detected. Starting compiled server (dist/server.js)...'
  );

  const serverJsPath = path.resolve(__dirname, '../dist/server.js');
  if (!fs.existsSync(serverJsPath)) {
    console.warn('[Runner] dist/server.js not found. Running build first...');
    const { execSync } = require('child_process');
    execSync('npm run build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  }

  const child = spawn('node', ['dist/server.js'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });

  const forwardSignal = (sig) => {
    if (child && !child.killed) child.kill(sig);
  };
  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGTERM', () => forwardSignal('SIGTERM'));

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
