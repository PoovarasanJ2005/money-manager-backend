const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Default categories to create for new users
const defaultCategories = [
    { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
    { name: 'Freelance', type: 'income', icon: '💼', color: '#3b82f6' },
    { name: 'Investment', type: 'income', icon: '📈', color: '#8b5cf6' },
    { name: 'Food', type: 'expense', icon: '🍔', color: '#ef4444' },
    { name: 'Fuel', type: 'expense', icon: '⛽', color: '#f59e0b' },
    { name: 'Movie', type: 'expense', icon: '🎬', color: '#ec4899' },
    { name: 'Medical', type: 'expense', icon: '🏥', color: '#06b6d4' },
    { name: 'Loan', type: 'expense', icon: '🏦', color: '#6366f1' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#a855f7' },
    { name: 'Transport', type: 'expense', icon: '🚗', color: '#14b8a6' },
    { name: 'Bills', type: 'expense', icon: '📄', color: '#f97316' },
    { name: 'Entertainment', type: 'expense', icon: '🎮', color: '#84cc16' }
];

// Register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }

            // Create new user
            const user = new User({
                name,
                email,
                password
            });

            await user.save();

            // Create default categories for the user
            const categories = defaultCategories.map(cat => ({
                ...cat,
                userId: user._id,
                isDefault: true
            }));

            await Category.insertMany(categories);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Error registering user',
                error: error.message
            });
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Find user with password field
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging in',
                error: error.message
            });
        }
    }
);

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

module.exports = router;
