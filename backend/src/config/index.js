module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

console.log('JWT_SECRET:', module.exports.JWT_SECRET);