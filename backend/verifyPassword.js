const bcrypt = require('bcrypt');

const password = '1'; // Ganti dengan password yang Anda gunakan di frontend
const hash = '$2b$10$BgX49q3SKgNPwtkYBz8RX.1oX4pqzBHscBbneR6kRCLI8uKKruOIK';

bcrypt.compare(password, hash).then(isMatch => {
  console.log('Password match:', isMatch);
});