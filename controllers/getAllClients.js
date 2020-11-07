const clientModel = require("../models/client");

// Getting a list with all clients
// Endpoint that returns a list with all clients in the clients-collection

module.exports = async(req, res) => {
    try {
        // Using .find() to return all documents in the accounts-collection
        let clients = await clientModel.find().exec();
        console.log('---------- ALL CLIENTS ---------- ');
        console.log(clients);

        res.json(clients)
        
    } catch (err) {
        console.log({ message: err })
    }
};
