import mongoose from 'mongoose';

// schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    CreatedAT: { type: Date, default: Date.now },
});

// model
export const User = mongoose.model('User', userSchema);