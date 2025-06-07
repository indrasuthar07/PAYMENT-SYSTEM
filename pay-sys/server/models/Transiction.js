const mongoose = require('mongoose');
const TransictionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    description: {
        type: String,
        default: '',
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('transictions', TransictionSchema);