import express from 'express';
import {DeleteContactById, UpdateContactById, getContactById, getALLConatacts, NewContacts, getContactByUserId } from '../Controllers/contact.js';
import { isAthenticated } from '../Middlewares/Authentications.js';

const router = express.Router();

// user Contact
// @api dsc :- Creating a new contact
// @api method :- post
// @api endPoint :- /api/contact/new
router.post('/new', isAthenticated, NewContacts);

// Get all contacts
router.get('/', getALLConatacts)

// Get contact by id
router.get('/:id', getContactById)

// Get user specific contact
router.get('/userid/:id', getContactByUserId)

// Update contact by id
router.put('/:id', isAthenticated, UpdateContactById)

// Delete contact by id
router.delete('/:id', isAthenticated, DeleteContactById)


export default router; // this line exports the router object, making it available for use in other files. This is a common practice in Express applications to modularize routes and keep the code organized. By exporting the router, you can import it in your main application file (e.g., app.js or server.js) and use it as middleware to handle requests to the specified endpoints.
// This allows you to define routes in separate files, making your codebase cleaner and easier to maintain. In this case, the router is handling the "/api/contact/new" endpoint for creating a new contact.