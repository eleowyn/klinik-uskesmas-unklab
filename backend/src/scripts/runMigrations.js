const { spawn } = require('child_process');
const path = require('path');

const migrations = [
  'migratePatientAddresses.js'
];

async function runMigration(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning migration: ${scriptName}`);
    console.log('='.repeat(50));

    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✓ Migration ${scriptName} completed successfully`);
        resolve();
      } else {
        console.error(`\n✗ Migration ${scriptName} failed with code ${code}`);
        reject(new Error(`Migration failed with code ${code}`));
      }
    });
  });
}

async function runAllMigrations() {
  try {
    for (const migration of migrations) {
      await runMigration(migration);
    }
    console.log('\nAll migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nMigration process failed:', error);
    process.exit(1);
  }
}

runAllMigrations();
