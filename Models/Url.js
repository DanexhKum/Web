import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    ShortCode: { type: String },
    OriginalURL: { type: String, required: true },
});

export const Url = mongoose.model('shortURL', urlSchema);