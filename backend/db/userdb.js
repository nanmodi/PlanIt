import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

// User Preference Schema
const userPreferenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locationPreference: { type: String, default: "Anywhere" },  
  activity: { type: [String], default: [] },  
  budget: { type: [Number], default: [] }  
}, { timestamps: true });

const User = model('User', userSchema);
const UserPreference = model('UserPreference', userPreferenceSchema);

export { User, UserPreference };
