const clientModel = require("../models/client");

// Get a specific client
// Implementing an endpoint, that will be able to return a specific client by id.

// Finding a specific client by ID
module.exports = async(req, res) => {
    try {
        let clientId = req.params.id;
        console.log('---------- GET CLIENT ---------- ');
        console.log(`ClientID: ${clientId}`);

        let client = await clientModel.findById(clientId).exec();
        console.log(`Account of customer ${client.firstname} found: `);
        

        let message = `Customer ${client.firstname} has following information `;
        console.log(`-> CLIENT: `);
        console.log(client);

        res.json({
            message,
            client
        })

    } catch (err) {
        console.log({ message: err })
    }
};