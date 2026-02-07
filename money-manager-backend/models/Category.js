const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'both'],
        default: 'both'
    },
    icon: {
        type: String,
        default: '📁'
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for unique categories per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
