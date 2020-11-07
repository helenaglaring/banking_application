const mongoose = require('mongoose');

// Creating a model used for our transactions; when we want to transfer money from one account to another.
const TransactionsSchema = new mongoose.Schema({
    /**
     * the schema follows this structure:
     * <fieldName>: {
     *  type: <type>,
     *  required: <bool>
     * },
     * <anotherFieldName>: {
     *  type: <type>,
     *  required: <bool>
     * }, and so on.
     */

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