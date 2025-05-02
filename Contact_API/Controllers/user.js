import { User } from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    const { name, email, password } = req.body;
    if (name == "" || email == "" || password == "") {  // check if any field is empty
        return res.json({ message: "Please fill all the fields" });
    }

    let user = await User.findOne({ email }); // check if user already exists
    if (user) {
        return res.json({ message: "User already exists" });
    }

    // Hash the password:
    const HashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    user = await User.create({ name, email, password: HashedPassword });
    res.json({ message: "User registered successfully", user });
};

export const LoginUser = async (req, res) => {

    const { email, password } = req.body;
    if (email == "" || password == "")
        return res.json({ message: "All fields are required" });
    const user = await User.findOne({ email })

    if (!user)
        return res.json({ message: "User not found", success: false });

    const isPasswordMatched = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    if (!isPasswordMatched)
        return res.json({ message: "Invalid Password!", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create a token with user id and secret key
    // user.password = undefined; // remove the password from the user object

    res.json({ message: `Welcome ${user.name}`, token, success: true });
};