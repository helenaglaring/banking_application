const clientModel = require("../models/client");


// Endpoint to delete an excisting client
// Using the client_id
// TODO: if deleting client > accounts with client_id must be deleted to?
module.exports = async(req, res) => {
    try {
        let clientId = req.params.id;

        console.log('---------- DELETE CLIENT ---------- ');
        console.log(`ClientID: ${clientId}`);

        // Finding the 'original' client by the client ID
        let client = await clientModel.findById(clientId).exec();
        console.log(`Account of customer ${clientId.firstname} found: `);
        console.log(client);

        // Delete excisting client using the findByIdAndDelete.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let delClient = await clientModel.findByIdAndDelete(clientId).exec();

        console.log(`-> CLIENT WAS DELETED: `);
        let message = `Customer ${client.firstname} was deleted from the clients-collection`;
        console.log(message);
        

        res.json({
            message,
            delClient
        })

    } catch (err) {
        console.log({ message: err })
    }
};
