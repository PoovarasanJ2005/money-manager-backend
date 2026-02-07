const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions with filters
router.get('/', auth, async (req, res) => {
    try {
        const {
            type,
            category,
            division,
            startDate,
            endDate,
            account,
            page = 1,
            limit = 50
        } = req.query;

        // Build filter query
        const filter = { userId: req.userId };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (division) filter.division = division;
        if (account) filter.account = account;

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.date.$lte = end;
            }
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const transactions = await Transaction.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        // Get total count
        const total = await Transaction.countDocuments(filter);

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

// Get single transaction
router.get('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: { transaction }
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message
        });
    }
});

// Create transaction
router.post(
    '/',
    auth,
    [
        body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
        body('category').trim().notEmpty().withMessage('Category is required'),
        body('division').isIn(['office', 'personal']).withMessage('Division must be office or personal'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('date').optional().isISO8601().withMessage('Invalid date format')
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

            const { type, amount, category, division, description, date, account } = req.body;

            const transaction = new Transaction({
                userId: req.userId,
                type,
                amount,
                category,
                division,
                description,
                date: date || new Date(),
                account: account || 'default'
            });

            await transaction.save();

            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: { transaction }
            });
        } catch (error) {
            console.error('Create transaction error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating transaction',
                error: error.message
            });
        }
    }
);

// Update transaction
router.put(
    '/:id',
    auth,
    [
        body('type').optional().isIn(['income', 'expense']),
        body('amount').optional().isFloat({ min: 0.01 }),
        body('category').optional().trim().notEmpty(),
        body('division').optional().isIn(['office', 'personal']),
        body('description').optional().trim().notEmpty(),
        body('date').optional().isISO8601()
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

            // Find transaction
            const transaction = await Transaction.findOne({
                _id: req.params.id,
                userId: req.userId
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
            }

            // Check if transaction can be edited (within 12 hours)
            if (!transaction.canEdit()) {
                return res.status(403).json({
                    success: false,
                    message: 'Transaction cannot be edited after 12 hours'
                });
            }

            // Update fields
            const { type, amount, category, division, description, date, account } = req.body;

            if (type) transaction.type = type;
            if (amount) transaction.amount = amount;
            if (category) transaction.category = category;
            if (division) transaction.division = division;
            if (description) transaction.description = description;
            if (date) transaction.date = date;
            if (account) transaction.account = account;

            transaction.updatedAt = new Date();
            await transaction.save();

            res.json({
                success: true,
                message: 'Transaction updated successfully',
                data: { transaction }
            });
        } catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating transaction',
                error: error.message
            });
        }
    }
);

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Check if transaction can be edited (within 12 hours)
        if (!transaction.canEdit()) {
            return res.status(403).json({
                success: false,
                message: 'Transaction cannot be deleted after 12 hours'
            });
        }

        await Transaction.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
});

// Get transaction summary by category
router.get('/summary/by-category', auth, async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;

        const matchStage = { userId: req.userId };

        if (type) matchStage.type = type;

        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                matchStage.date.$lte = end;
            }
        }

        const summary = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        category: '$category',
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.json({
            success: true,
            data: { summary }
        });
    } catch (error) {
        console.error('Get category summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category summary',
            error: error.message
        });
    }
});

module.exports = router;
