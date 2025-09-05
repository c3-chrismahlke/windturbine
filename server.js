// server.js
const { spawn } = require('child_process');

// Start Next.js
const dev = spawn('next', ['dev'], { stdio: 'inherit', shell: true });

// Handle Ctrl+C and termination signals
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT (Ctrl+C) — shutting down...');
  dev.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM — shutting down...');
  dev.kill('SIGTERM');
  process.exit(0);
});
