import mongoose from 'mongoose';

const uri = "mongodb+srv://nandinimodi22b:Nandini%4023@cluster0.4oqwfca.mongodb.net/planit?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

export default run;
