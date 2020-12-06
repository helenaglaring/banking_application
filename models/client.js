const mongoose = require('mongoose');

// Creating the Client-model and defining the shcema of the Client-collection
const ClientSchema = new mongoose.Schema({
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