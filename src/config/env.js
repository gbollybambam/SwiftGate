require('dotenv').config();

const requiredEnvs = ['PORT', 'DATABASE_URL'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  // Hard crash with the exact missing variables named
  console.error(`CRITICAL ERROR: Missing required environment variables: ${missingEnvs.join(', ')}`);
  process.exit(1); 
}

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL
};