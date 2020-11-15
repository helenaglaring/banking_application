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

        let clie;

        clientModel.findOne({}, function (err, client) {
            clie = client;
            console.log("client")
          console.log(client)
          });
          console.log("clie")
          console.log(clie)
          

        res.json({
            client
        })

    } catch (err) {
        console.log({ message: err })
    }
};