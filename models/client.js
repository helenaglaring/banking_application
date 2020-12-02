const mongoose = require('mongoose');


const ClientSchema = new mongoose.Schema({
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

    firstname: {
        type: String,
        required: [true, "Please fill out 'firstname"],
    },
    lastname: {
        type: String,
        required: [true, "Please fill out 'lastname"],
    },
    streetAddress: {
        type: String,
        required: [true, "Please fill out 'streetAddress"],
    },
    city: {
        type: String,
        required: [true, "Please fill out 'city"],
    },

});

const model = mongoose.model('Client', ClientSchema);

module.exports = model;