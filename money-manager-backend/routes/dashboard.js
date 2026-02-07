const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to get date range
const getDateRange = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
        case 'weekly':
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as first day
            startDate = new Date(now);
            startDate.setDate(now.getDate() - diff);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
};

// Get dashboard overview
router.get('/overview', auth, async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        // Get income and expense totals

        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const income = summary.find(s => s._id === 'income') || { total: 0, count: 0 };
        const expense = summary.find(s => s._id === 'expense') || { total: 0, count: 0 };
        const balance = income.total - expense.total;

        // Get category breakdown
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
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
            },
            {
                $limit: 10
            }
        ]);

        // Get division breakdown
        const divisionBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        division: '$division',
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                period,
                dateRange: { startDate, endDate },
                summary: {
                    income: income.total,
                    expense: expense.total,
                    balance,
                    incomeCount: income.count,
                    expenseCount: expense.count
                },
                categoryBreakdown,
                divisionBreakdown
            }
        });
    } catch (error) {
        console.error('Dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
});

// Get trends (daily breakdown for a period)
router.get('/trends', auth, async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const trends = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: period === 'yearly' ? '%Y-%m' : '%Y-%m-%d',
                                date: '$date'
                            }
                        },
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                period,
                dateRange: { startDate, endDate },
                trends
            }
        });
    } catch (error) {
        console.error('Dashboard trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trends data',
            error: error.message
        });
    }
});

// Get recent transactions
router.get('/recent', auth, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ date: -1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { transactions }
        });
    } catch (error) {
        console.error('Recent transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent transactions',
            error: error.message
        });
    }
});

// Get account summary
router.get('/accounts', auth, async (req, res) => {
    try {
        const accounts = await Transaction.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.userId) }
            },
            {
                $group: {
                    _id: {
                        account: '$account',
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.account',
                    transactions: {
                        $push: {
                            type: '$_id.type',
                            total: '$total',
                            count: '$count'
                        }
                    }
                }
            }
        ]);

        // Calculate balance for each account
        const accountSummary = accounts.map(acc => {
            const income = acc.transactions.find(t => t.type === 'income') || { total: 0, count: 0 };
            const expense = acc.transactions.find(t => t.type === 'expense') || { total: 0, count: 0 };

            return {
                account: acc._id,
                income: income.total,
                expense: expense.total,
                balance: income.total - expense.total,
                transactionCount: income.count + expense.count
            };
        });

        res.json({
            success: true,
            data: { accounts: accountSummary }
        });
    } catch (error) {
        console.error('Account summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching account summary',
            error: error.message
        });
    }
});

// Get statistics
router.get('/statistics', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = { userId: new mongoose.Types.ObjectId(req.userId) };

        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                matchStage.date.$lte = end;
            }
        }

        const stats = await Transaction.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    overall: [
                        {
                            $group: {
                                _id: '$type',
                                total: { $sum: '$amount' },
                                count: { $sum: 1 },
                                average: { $avg: '$amount' },
                                max: { $max: '$amount' },
                                min: { $min: '$amount' }
                            }
                        }
                    ],
                    byCategory: [
                        {
                            $group: {
                                _id: { category: '$category', type: '$type' },
                                total: { $sum: '$amount' },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { total: -1 } }
                    ],
                    byDivision: [
                        {
                            $group: {
                                _id: { division: '$division', type: '$type' },
                                total: { $sum: '$amount' },
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;
