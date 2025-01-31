const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Render Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register',
    [
        body('email').trim().isEmail().withMessage("Invalid email"),
        body('password').trim().isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
        body('username').trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid Data',
            });
        }

        const { username, password, email } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            email,
            username,
            password: hashPassword,
        });

        res.json(newUser);
    }
);

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login',
        body('username').trim().isLength({min : 3}).withMessage("Invalid email"),
        body('password').trim().isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid Data',
            });
        }

        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Username is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(400).json({ message: " Password is incorrect" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie('token', token);
        res.send("Logged In")
    }
);

module.exports = router;
