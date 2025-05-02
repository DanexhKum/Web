import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    type: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },  // User ID
    createdAt: { type: Date, default: Date.now },
});

export const Contact = mongoose.model('Contact', ContactSchema)