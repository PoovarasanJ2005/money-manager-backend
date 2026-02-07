const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
    try {
        const { type } = req.query;

        const filter = { userId: req.userId };
        if (type && type !== 'both') {
            filter.$or = [{ type }, { type: 'both' }];
        }

        const categories = await Category.find(filter).sort({ name: 1 });

        res.json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// Create category
router.post(
    '/',
    auth,
    [
        body('name').trim().notEmpty().withMessage('Category name is required'),
        body('type').optional().isIn(['income', 'expense', 'both']),
        body('icon').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { name, type, icon, color } = req.body;

            // Check if category already exists
            const existingCategory = await Category.findOne({
                userId: req.userId,
                name: name.trim()
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }

            const category = new Category({
                userId: req.userId,
                name: name.trim(),
                type: type || 'both',
                icon: icon || '📁',
                color: color || '#6366f1',
                isDefault: false
            });

            await category.save();

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: { category }
            });
        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating category',
                error: error.message
            });
        }
    }
);

// Update category
router.put(
    '/:id',
    auth,
    [
        body('name').optional().trim().notEmpty(),
        body('type').optional().isIn(['income', 'expense', 'both']),
        body('icon').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i)
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const category = await Category.findOne({
                _id: req.params.id,
                userId: req.userId
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            const { name, type, icon, color } = req.body;

            if (name) category.name = name.trim();
            if (type) category.type = type;
            if (icon) category.icon = icon;
            if (color) category.color = color;

            await category.save();

            res.json({
                success: true,
                message: 'Category updated successfully',
                data: { category }
            });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating category',
                error: error.message
            });
        }
    }
);

// Delete category
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (category.isDefault) {
            return res.status(403).json({
                success: false,
                message: 'Default categories cannot be deleted'
            });
        }

        await Category.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
});

module.exports = router;
