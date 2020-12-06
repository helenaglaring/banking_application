const mongoose = require('mongoose');

// Creating a model used for our transactions; when we want to transfer money from one account to another.
const TransactionsSchema = new mongoose.Schema({
    fromAccount: {
        type: Object,
        required: true,
    },
    toAccount: {
        type: Object,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

const model = mongoose.model('Transactions', TransactionsSchema);

module.exports = model;