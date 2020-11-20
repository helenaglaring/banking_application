const clientModel = require('../models/client');
const accountModel = require('../models/account');

/*

getClients          // GET all clients
createClient        // POST new client
getClient           // GET client
updateClient        // UPDATE client information
deleteClient        // DELETE client
getClientAccounts   // GET all client's accounts

*/

module.exports = {

// -------------------- GET all clients --------------------//

    // Endpoint that returns a list with all clients in the clients-collection
    getClients: async(req, res) => {
        try {
            // Using .find() to return all documents in the accounts-collection
            let clients = await clientModel.find().exec();
            console.log('---------- ALL CLIENTS ---------- ');
            console.log(clients);

            return res.status(200).json(clients)
            
        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("Something went wrong");
        }
    },

// -------------------- CREATE new client --------------------//
    // Endpoint for creating a new client
    createClient: async(req, res) => {
    
        try {
            const { firstname, lastname, streetAddress, city } = req.body;   // extracting client info

            let newClient = await clientModel.create({
                firstname: firstname,
                lastname: lastname,
                streetAddress: streetAddress,
                city: city
            });


            console.log('---------- CREATE CLIENT ---------- ');
            console.log('New client created: ');
            console.log(newClient);

            return res.status(200).json(newClient)

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send(err.message);
        }
    },
// -------------------- GET client --------------------//
    // Endpoint, that returns a specific client by clientId
    getClient: async(req, res) => {
        try {
            let clientId = req.params.id;
            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            let client = await clientModel.findById(clientId).exec();

            console.log(`Customer ${client.firstname} has following information: `)
            console.log(`-> CLIENT: `);
            console.log(client);

            return res.status(200).json(client)

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send(err.message);
        }
    },

// -------------------- UPDATE client --------------------//
    // Endpoint to update the information of an excisting client by clientId
    // Todo: Change alias in account with same client ID
    updateClient: async(req, res) => {
        try {
            let clientId = req.params.id;
            const {firstname, lastname, streetAddress, city} = req.body; // extracting customer info

            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);


            // Finding the 'original' account by the account ID
            let originalClient = await clientModel.findById(clientId).exec();
            //if(!originalClient) throw "No client"
            console.log(`Client with current name '${originalClient.firstname}' found: `);
            console.log(originalClient);

            // Creating the new client object with the properties that needs to be updated
            let newClient = {
                firstname: firstname || originalClient.firstname,
                lastname: lastname || originalClient.lastname,
                streetAddress: streetAddress || originalClient.streetAddress,
                city: city || originalClient.city
            }
            console.log("New client object")
            console.log(newClient);


            // Update excisting client using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updClient = await clientModel.findByIdAndUpdate(
                // Filtering by the _id of the clint we want to update
                clientId, 
                // Update all the attributes in the Address schema by passing in the newClient-object with the updated attributes
                newClient, 
                // We want the updated object returned. Therefore we set it to true.
                {new: true, useFindAndModify: false} ).exec();

            console.log(`-> CLIENT WAS UPDATED: `);
            console.log(`CLIENT ${updClient.firstname}'s information was updated:`)
            console.log('From: ');
            console.log(originalClient);
            console.log('To: ');
            console.log(updClient);

            // Update alias in account collection
            let updateAccountAlias = await accountModel.updateMany({"client_id": clientId}, {"alias": updClient.firstname}).exec()
            console.log(updateAccountAlias);

            return res.status(200).json(updClient)

        } catch (err) {
            console.log({ message: err })
            console.log(err.message)
            return res.status(404).send(err.message);
        }
    },


// -------------------- DELETE client --------------------//
    // Endpoint to delete an excisting client using clientId
    // TODO: if deleting client > accounts with client_id must be deleted to?
    deleteClient: async(req, res) => {
        try {
            let clientId = req.params.id;

            console.log('---------- DELETE CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            // Finding the 'original' client by the client ID
            let client = await clientModel.findById(clientId).exec();
            console.log(`Account of customer ${client.firstname} found: `);
            console.log(client)


            // Delete excisting client using the findByIdAndDelete.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let delClient = await clientModel.findByIdAndDelete(clientId).exec();

            console.log(`-> CLIENT WAS DELETED: `);
            console.log(`Customer ${client.firstname} was deleted from the clients-collection`);
 
            return res.status(200).json(delClient)

        } catch (err) {

            console.log({ message: err })
            return res.status(404).send(err.message);
        }
    },


// -------------------- GET client accounts --------------------//
    // Get all accounts of a specific client by clientId
    // Endpoint, that returns all accounts of a specific client by client_id
    getClientAccounts: async(req, res) => {
        try {
            let clientId = req.params.id;
            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            let client = await clientModel.findById(clientId).exec();
            console.log(`Account of customer ${client.firstname} found: `);
            

            console.log(`-> CLIENT: `);
            console.log(client);

            let accounts = await accountModel.find({"client_id":clientId}).exec();

            console.log(`-> ACCOUNTS: `);
            console.log(`Customer ${client.firstname} has following accounts: `)
            console.log(accounts);


            return res.status(200).json({
                accounts
            })

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("Something went wrong");
        }
    }
}