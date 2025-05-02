import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

// Middleware to check if user is authenticated
export const isAthenticated = async (req, res, next) => {
    try {
        // Check if headers and Authorization header exist
        if (!req.headers || !req.headers.authorization) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1] // Extract token if "Bearer" prefix exists
            : authHeader; // Use the raw token if no "Bearer" prefix

        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Find user by ID
        const id = decoded.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    };
};