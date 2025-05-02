// we need to download shortid package to generate short URLs
import shortid from 'shortid';
import { Url } from '../Models/Url.js';

export const ShortURL = async (req, res) => {
    console.log(req.body); // Log the request body
    const OriginalURL = req.body.LongURL;
    const ShortCode = shortid.generate();
    const shortURL = 'http://localhost:3000/' + ShortCode;

    const newUrl = new Url({ ShortCode, OriginalURL });
    await newUrl.save();

    console.log('Saved document:', newUrl);
    res.render('index.ejs', { shortURL });
};

export const getOriginalURL = async (req, res) => {
    const shortCode = req.params.shortCode  // Extract the short code from the request parameters

    // find on Database
    const originalUrl = await Url.findOne({ ShortCode: shortCode })

    if (originalUrl) {
        res.redirect(originalUrl.OriginalURL);
    } else {
        res.json({ message: "Invalid ShortCode!" })
    }

}