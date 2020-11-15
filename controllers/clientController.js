const getAllClientsController = require('../controllers/getAllClients');        // GET all clients
const getClientController = require('../controllers/getClient');                // GET client
const createClientController = require('../controllers/createClient');          // POST new client
const updateClientController = require('../controllers/updateClient');          // UPDATE client information
const deleteClientController = require('../controllers/deleteClient');          // DELETE client
const getClientAccountsController = require('../controllers/getClientAccounts');// GET all client's accounts

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

    // Endpoint that returns a list with all clients in the clients-collection
    getClients: async(req, res) => {
        try {
            // Using .find() to return all documents in the accounts-collection
            let clients = await clientModel.find().exec();
            console.log('---------- ALL CLIENTS ---------- ');
            console.log(clients);

            res.json(clients)
            
        } catch (err) {
            console.log({ message: err })
        }
    },

    // Endpoint for creating a new client
    createClient: async(req, res) => {
        try {
            //console.log(req.body);

            const { firstname, lastname, streetAddress, city } = req.body;   // extracting client info
        

            let newClient= await clientModel.create({
                firstname: firstname,
                lastname: lastname,
                street_address: streetAddress,
                city: city
            });


            console.log('---------- CREATE CLIENT ---------- ');
            let message = "New client created: ";
            console.log(message);
            console.log(newClient);

            res.json(newClient)

        } catch (err) {
            console.log({ message: err })
        }
    },

    // Get a specific client 
    // Endpoint, that returns a specific client by clientId
    getClient: async(req, res) => {
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
    },


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
                console.log(`Client with current name '${originalClient.firstname}' found: `);
                console.log(originalClient);

                // Creating the new client object with the properties that needs to be updated
                let newClient = {
                    firstname: firstname || originalClient.firstname,
                    lastname: lastname || originalClient.lastname,
                    street_address: streetAddress || originalClient.street_address,
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
                let updMessage = `CLIENT ${updClient.firstname}'s information was updated:`;
                console.log(updMessage);
                console.log("From: ");
                console.log(originalClient);
                console.log("To: ");
                console.log(updClient);


                // Update alias in account collection
                let updateAccountAlias = await accountModel.updateMany({"client_id": clientId}, {"alias": updClient.firstname})
                console.log(updateAccountAlias);

                res.json(updClient)

            } catch (err) {
                console.log({ message: err })
            }
        },



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
            let delClient = await clientModel.findByIdAndDelete(clientId).lean().exec();

            console.log(`-> CLIENT WAS DELETED: `);
            let message = `Customer ${client.firstname} was deleted from the clients-collection`;
            console.log(message);

        

            res.json({
                delClient
            })

        } catch (err) {
            console.log({ message: err })
        }
    },



    // Get all accounts of a specific client by clientId
    // Endpoint, that returns all accounts of a specific client by client_id
    getClientAccounts: async(req, res) => {
        try {
            let clientId = req.params.id;
            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            let client = await clientModel.findById(clientId).exec();
            console.log(`Account of customer ${client.firstname} found: `);
            

            let message = `Customer ${client.firstname} has following accounts `;
            console.log(`-> CLIENT: `);
            console.log(client);


            let accounts = await accountModel.find({"client_id":clientId}).exec();
    
            console.log(message);
            console.log(`-> ACCOUNTS: `);
            console.log(accounts);



            res.json({
                accounts
            })

        } catch (err) {
            console.log({ message: err })
        }
    }




}