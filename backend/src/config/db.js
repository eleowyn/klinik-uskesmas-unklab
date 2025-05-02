const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klinik_uskemask_unklab';
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Test the connection and log database details
    const db = mongoose.connection;
    
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    });

    db.once('open', async () => {
      console.log('MongoDB connection is open');
      
      // Log database information
      try {
        const dbName = db.name;
        const collections = await db.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        console.log('Connected to database:', dbName);
        console.log('Available collections:', collectionNames);
        
        // Log document counts for relevant collections
        if (collectionNames.includes('patients')) {
          const patientCount = await db.collection('patients').countDocuments();
          console.log('Patient collection count:', patientCount);
        }
        
        if (collectionNames.includes('transactions')) {
          const transactionCount = await db.collection('transactions').countDocuments();
          console.log('Transaction collection count:', transactionCount);
        }
        
        if (collectionNames.includes('appointments')) {
          const appointmentCount = await db.collection('appointments').countDocuments();
          console.log('Appointment collection count:', appointmentCount);
        }
      } catch (error) {
        console.error('Error getting database information:', error);
      }
    });

    // Monitor connection status changes
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Database connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

module.exports = connectDB;
