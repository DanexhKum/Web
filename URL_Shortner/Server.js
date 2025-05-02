import express from 'express';
import mongoose from 'mongoose';
import { ShortURL, getOriginalURL } from './Controllers/url.js';

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://DhaneshKumar:KaVeL2jg6zuBD6tZ@cluster0.uhjkz7r.mongodb.net/',
    {
        dbName: 'NodejsWebdevMasteryCourse'
    }
).then(() => {
    console.log('Connected to MongoDB Atlas')
}).catch((err) => {
    console.log('Error connecting to MongoDB Atlas', err)
})

app.get('/', (req, res) => {
    res.render('index.ejs', { shortURL: null })  // Render the index.ejs file with a null shortURL
})


app.post('/shorten', ShortURL) // Handle the POST request to shorten the URL
app.get('/:shortCode', getOriginalURL)  // Handle the GET request to redirect to the original URL

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})