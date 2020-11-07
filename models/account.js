const mongoose = require('mongoose');

// 3. Finish the account schema
const AccountSchema = new mongoose.Schema({
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

    client_id: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: false,
    },
    alias: {
        type: String,
        required: false,
    },
});

const model = mongoose.model('Account', AccountSchema);

module.exports = model;