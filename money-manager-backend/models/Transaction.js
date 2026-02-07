const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Transaction type is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    division: {
        type: String,
        enum: ['office', 'personal'],
        required: [true, 'Division is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    account: {
        type: String,
        default: 'default',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, division: 1 });

// Method to check if transaction can be edited (within 12 hours)
transactionSchema.methods.canEdit = function () {
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    const timeDiff = Date.now() - this.createdAt.getTime();
    return timeDiff < twelveHoursInMs;
};

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
    return this.amount.toFixed(2);
});

// Ensure virtuals are included in JSON
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);
