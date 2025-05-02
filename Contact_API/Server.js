import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'express'; // to parse json data
import userRoutes from './Routes/user.js'; // import user routes
import contactRoutes from './Routes/contact.js'; // import contact routes
import {config} from 'dotenv'; 

const app = express();

app.use(bodyParser.json()); // to parse json data

// dotenv(.env) Setup
config({path: '.env'})

// @api routes
app.use('/api/user', userRoutes);

// @api routes
app.use('/api/contact', contactRoutes);

// home route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the home page" });
})



// database connectivity
mongoose.connect(process.env.MONGO_URL,
    {
        dbName: 'NodejsWebdevMasteryCourse',
    }
).then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("Error connecting to MongoDB Atlas", err))


const port = process.env.PORT
app.listen(port, () => { console.log(`Server is running on port ${port}`) });