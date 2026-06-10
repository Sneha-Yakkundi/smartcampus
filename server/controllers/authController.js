const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// REGISTER
exports.register = async (req, res) => {

    try {

        const { name, email, password, adminKey, facultyKey, department } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine role: Check if valid keys are provided
        let userRole = "student"; // Default role
        
        if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
            userRole = "admin";
        } else if (facultyKey && facultyKey === process.env.FACULTY_SECRET_KEY) {
            userRole = "faculty";
        } else if (adminKey || facultyKey) {
            // Invalid keys provided
            return res.status(403).json({
                message: "Invalid credentials. Registration failed."
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            department: department || null
        });

        // Return success response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};


// LOGIN
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log("Login attempt for:", email);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({
                message: "User not found"
            });
        }

        console.log("User found, comparing passwords");

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        console.log("Password matched, generating token");

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("Token generated successfully for user:", email);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        console.error("Login error:", err);

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "name", "email", "role"]
        });

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// GET ALL USERS (ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.user.id);

        // Only admins can view all users
        if (currentUser.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        const users = await User.findAll({
            attributes: ["id", "name", "email", "role", "createdAt"]
        });

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// PROMOTE USER TO ADMIN (ADMIN ONLY)
exports.promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUser = await User.findByPk(req.user.id);

        // Only admins can promote users
        if (currentUser.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "User is already an admin"
            });
        }

        user.role = "admin";
        await user.save();

        res.json({
            message: "User promoted to admin successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// DEMOTE ADMIN TO STUDENT (ADMIN ONLY)
exports.demoteToStudent = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUser = await User.findByPk(req.user.id);

        // Only admins can demote users
        if (currentUser.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        // Prevent demoting yourself
        if (currentUser.id === userId) {
            return res.status(400).json({
                message: "Cannot demote yourself"
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "student") {
            return res.status(400).json({
                message: "User is already a student"
            });
        }

        user.role = "student";
        await user.save();

        res.json({
            message: "User demoted to student successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};