const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Staff = require('./models/Staff');

mongoose.connect('mongodb://localhost:27017/klinik');

async function hashPasswords() {
  try {
    const staffs = await Staff.find(); // Ambil semua dokumen dari koleksi staff
    if (staffs.length === 0) {
      console.log('No staff found in the database');
      mongoose.connection.close();
      return;
    }

    for (const staff of staffs) {
      if (!staff.password || !staff.password.startsWith('$2')) {
        const originalPassword = '1'; // Gunakan password baru yang konsisten
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(originalPassword, saltRounds);
        staff.password = hashedPassword;
        await staff.save();
        const updatedStaff = await Staff.findOne({ username: staff.username });
        console.log(`Password hashed and updated for ${staff.username}:`);
        console.log(`Hashed value: ${hashedPassword}`);
        console.log(`Updated in DB: ${updatedStaff.password}`);
      } else {
        console.log(`Password for ${staff.username} is already hashed: ${staff.password}`);
      }
    }

    console.log('All passwords have been processed successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error hashing passwords:', err);
    mongoose.connection.close();
  }
}

hashPasswords();


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const Staff = require('./models/Staff');

// mongoose.connect('mongodb://localhost:27017/klinik', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function hashPasswords() {
//   try {
//     const staffs = await Staff.find(); // Ambil semua dokumen dari koleksi staff
//     if (staffs.length === 0) {
//       console.log('No staff found in the database');
//       mongoose.connection.close();
//       return;
//     }

//     for (const staff of staffs) {
//       const saltRounds = 10;
//       const originalPassword = '1'; // Gunakan password baru yang konsisten
//       const hashedPassword = await bcrypt.hash(originalPassword, saltRounds); // Hash langsung dari teks asli
//       staff.password = hashedPassword;
//       await staff.save();
//       console.log(`Password hashed successfully for ${staff.username}: ${hashedPassword}`);
//     }

//     console.log('All passwords have been hashed successfully');
//     mongoose.connection.close();
//   } catch (err) {
//     console.error('Error hashing passwords:', err);
//     mongoose.connection.close();
//   }
// }

// hashPasswords();
