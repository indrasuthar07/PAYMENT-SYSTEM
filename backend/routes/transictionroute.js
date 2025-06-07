const router = require('express').Router();
const Transaction = require('../models/Transiction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/transfer-payments', authMiddleware, async (req, res) => {
    try {
        const { amount, receiverId, description } = req.body;
        const senderId = req.user._id; 

        
        if (!amount || !receiverId) {
            return res.status(400).json({ message: 'Amount and receiver ID are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        // Get sender and receiver
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create transaction record
        const transaction = new Transaction({
            amount,
            type: 'transfer',
            sender: senderId,
            receiver: receiverId,
            description: description || '',
            status: 'pending'
        });

        // Update balances
        sender.balance -= amount;
        receiver.balance += amount;

        // Save all changes
        await Promise.all([
            transaction.save(),
            sender.save(),
            receiver.save()
        ]);

        // Update transaction status
        transaction.status = 'completed';
        await transaction.save();

        res.status(200).json({
            message: 'Transfer successful',
            transaction
        });

    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;