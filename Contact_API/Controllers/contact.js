import { Contact } from "../Models/Contact.js";

// @desc Created contacts
export const NewContacts = async (req, res) => {
    const { name, email, phone, type } = req.body;

    if (!name || !email || !phone || !type) {
        return res.json({ message: "Please fill all the fields" });
    }

    let SaveContact = await Contact.create({
        name,
        email,
        phone,
        type,
        user: req.user
    });

    res.json({ message: "Contact created successfully", SaveContact, Sucess: true });
};

// @desc Get all contacts
export const getALLConatacts = async (req, res) => {
    const Usercontacts = await Contact.find();

    if (!Usercontacts) {
        return res.json({ message: "No contacts found" });
    }
    res.json({ message: "Contacts found", Usercontacts, Sucess: true });
};

// @desc Get contact by id
export const getContactById = async (req, res) => {
    const id = req.params.id

    const Usercontact = await Contact.findById(id);
    if (!Usercontact) {
        return res.json({ message: "No contacts found" });
    }
    res.json({ message: "Contacts found", Usercontact, Sucess: true });
};

// @desc Get contact by user id (User Specific)
export const getContactByUserId = async (req, res) => {
    const id = req.params.id

    const Usercontact = await Contact.find({user:id});
    if (!Usercontact) {
        return res.json({ message: "No Contacts Found!" });
    }
    res.json({ message: "Contacts Fetched!", Usercontact, Sucess: true });
};

// @desc Update contact by id
export const UpdateContactById = async (req, res) => {
    const id = req.params.id
    const { name, email, phone, type } = req.body

    let UpdateContact = await Contact.findByIdAndUpdate(id, {
        name,
        email,
        phone,
        type
    }, { new: true }); // new used to return the updated document
    if (!UpdateContact) {
        return res.json({ message: "No contacts found" });
    }
    return res.json({ message: "Contact updated successfully", UpdateContact, Sucess: true });
};

// @desc Delete contact by id
export const DeleteContactById = async (req, res) => {
    const id = req.params.id

    let DeleteContact = await Contact.findByIdAndDelete(id);

    if (!DeleteContact) {
        return res.json({ message: "No contacts found" });
    }
    return res.json({ message: "Contact Deleted successfully", Sucess: true });
};