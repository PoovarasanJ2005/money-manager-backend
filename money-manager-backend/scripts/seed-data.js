const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/money-manager';

const sampleTransactions = [
    // Income
    { type: 'income', category: 'Salary', description: 'Monthly Salary', amount: 5000, division: 'office' },
    { type: 'income', category: 'Freelance', description: 'Website Project', amount: 1200, division: 'personal' },
    { type: 'income', category: 'Investment', description: 'Stock Dividend', amount: 300, division: 'personal' },

    // Expenses
    { type: 'expense', category: 'Food', description: 'Lunch at Cafe', amount: 25, division: 'personal' },
    { type: 'expense', category: 'Food', description: 'Grocery Shopping', amount: 150, division: 'personal' },
    { type: 'expense', category: 'Transport', description: 'Uber Ride', amount: 18, division: 'personal' },
    { type: 'expense', category: 'Transport', description: 'Fuel Refill', amount: 45, division: 'office' },
    { type: 'expense', category: 'Bills', description: 'Electricity Bill', amount: 120, division: 'personal' },
    { type: 'expense', category: 'Bills', description: 'Internet Subscription', amount: 60, division: 'office' },
    { type: 'expense', category: 'Entertainment', description: 'Movie Night', amount: 40, division: 'personal' },
    { type: 'expense', category: 'Shopping', description: 'New Headphones', amount: 200, division: 'personal' },
    { type: 'expense', category: 'Medical', description: 'Pharmacy', amount: 35, division: 'personal' },
    { type: 'expense', category: 'Food', description: 'Dinner with Client', amount: 85, division: 'office' },
    { type: 'expense', category: 'Salary', description: 'Bonus', amount: 1000, division: 'office' }, // Bonus as income
];

const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedData = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Find the most recent user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.error('❌ No users found! Please register a user in the app first.');
            process.exit(1);
        }

        console.log(`👤 Identifying user: ${user.email}`);

        // Get user's categories to map correct names
        const categories = await Category.find({ userId: user._id });

        console.log('🌱 Generating 50 sample transactions...');
        const transactions = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 45); // Last 45 days

        for (let i = 0; i < 50; i++) {
            const template = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];
            const date = getRandomDate(startDate, endDate);

            // Logic to ensure income is properly typed
            let type = template.type;
            if (template.category === 'Salary' || template.category === 'Freelance' || template.category === 'Investment') {
                type = 'income';
            }

            transactions.push({
                userId: user._id,
                type: type,
                amount: template.amount + Math.floor(Math.random() * 50), // Add some randomness to amount
                category: template.category,
                division: template.division,
                description: template.description,
                date: date,
                account: 'default'
            });
        }

        await Transaction.insertMany(transactions);
        console.log(`✨ Successfully added ${transactions.length} transactions!`);
        console.log(`Again start server`);
        console.log('🔄 Refresh your dashboard to see the data.');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seedData();
