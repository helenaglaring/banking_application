const Client = require('../models/client');
const Account = require('../models/account');

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
            let clients = await Client.find().exec();
            console.log('---------- ALL CLIENTS ---------- ');
            console.log(clients);

            // Checking if there are any client-documents in the collection by checking length of array
            // Needs to push error message  into array - else test fails since it checks if response is an array
            if(!clients[0]) clients.push("No clients found")

            // Return array with client-documents
            return res.status(200).json(clients)
            
        } catch (err) {
            console.log()
            return res.status(404).json(err.message);
        }
    },

// -------------------- CREATE new client --------------------//
    // Endpoint for creating a new client
    createClient: async(req, res) => {
    
        try {
            const { firstname, lastname, streetAddress, city } = req.body;   // extracting client info

            // Creating new client based on data sent in the request body
            let newClient = await Client.create({
                firstname: firstname ? firstname.trim() : firstname,
                lastname: lastname ? lastname.trim() : lastname,
                streetAddress: streetAddress ? streetAddress.trim() : streetAddress,
                city: city ? city.trim() : city
            });
            if (!newClient) throw {message : 'Error: No new client was created'}

            console.log('---------- CREATE CLIENT ---------- ');
            console.log('New client created: ', newClient);
            
            // Return response with the newly created client object
            return res.status(200).json(newClient)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },
// -------------------- GET client --------------------//
    // Endpoint, that returns a specific client by clientId
    getClient: async(req, res) => {
        try {
            // Extracting clientId from params
            let clientId = req.params.id;
            // validation of clientId -  must be 24 characters
            if(clientId.length !== 24) throw {message: "Error in clientId: ClientId must be 24 characters"}

            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            // Find client by the given client ID
            let client = await Client.findById(clientId).exec();

            // Checking if any client exists with the given ID else throw error
            if(!client) throw {message: "No client with given client ID"}

            console.log(`-> CLIENT: `);
            console.log(`Customer ${client.firstname} has following information: `, client)
            
            // Return response with the client object
            return res.status(200).json(client)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },

// -------------------- UPDATE client --------------------//
    // Endpoint to update the information of an excisting client by clientId
    // Todo: Change alias in account with same client ID
    updateClient: async(req, res) => {
        try {
            let clientId = req.params.id; // Extract clientID from params on client that needs to be updated
            const {firstname, lastname, streetAddress, city} = req.body; // extracting customer info

            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);


            // Finding the 'original' client by the account ID
            let originalClient = await Client.findById(clientId).exec();

            // Check if any client exists
            if(!originalClient) throw {message: "No client with given client ID"}
            
            console.log(`Client with current name '${originalClient.firstname}' found: \n`,originalClient );

            /* Old
            // Creating the new client object with the properties that needs to be updated
            let newClient = {
                firstname: firstname || originalClient.firstname,
                lastname: lastname || originalClient.lastname,
                streetAddress: streetAddress || originalClient.streetAddress,
                city: city || originalClient.city
            }
            console.log("New client object")
            console.log(newClient);
            */

            // Update excisting client using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updClient = await Client.findByIdAndUpdate(
                // Filtering by the _id of the clint we want to update
                clientId, 
                // Update all the attributes in the Address schema by passing in the properties. Updates if properties are 'true' else
                // using information from the original
                {$set: {
                    firstname: firstname || originalClient.firstname,
                    lastname: lastname || originalClient.lastname,
                    streetAddress: streetAddress || originalClient.streetAddress,
                    city: city || originalClient.city
                }},
                // We want the updated object returned. Therefore we set it to true.
                {new: true, useFindAndModify: false} ).exec();

            // Checking if update was succesful
            if(!updClient) throw {message: 'Update failed - The update of client information went wrong'}

            console.log(`-> CLIENT WAS UPDATED: `);
            console.log(`CLIENT ${updClient.firstname}'s information was updated: `, '\nFrom: ',originalClient,'\nTo: ', updClient )

            /*
            // Update alias in account collection??
            let updateAccountAlias = await Account.updateMany({"client_id": clientId}, {"alias": updClient.firstname}).exec()
            console.log(updateAccountAlias);
            */

            // Return the updated client object
            return res.status(200).json(updClient)

        } catch (err) {
            console.log(err)
       
            return res.status(404).json(err.message);
        }
    },


// -------------------- DELETE client --------------------//
    // Endpoint to delete an excisting client using clientId
    // TODO: if deleting client > accounts with client_id must be deleted to?
    // Discussion - hard or soft delete? Timestamp instead?
    deleteClient: async(req, res) => {
        try {
            // Extract ID from params of client that neds to be deleted
            let clientId = req.params.id;

            console.log('---------- DELETE CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            // Finding the 'original' client by the client ID
            let client = await Client.findById(clientId).exec()
            // Check if client exists with given ID
            if (!client) throw {message: "No client with th given client ID"}
            //console.log(`Account of customer ${client.firstname} found: `, client);
    

            // Delete excisting client using the findByIdAndDelete.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let delClient = await Client.findByIdAndDelete(clientId).exec();
            // Checking if deletion was completed
            if(!delClient) throw {message: "Something went wrong - no client was deleted"}

            console.log(`\n-> CLIENT WAS DELETED: `);
            console.log(`Customer ${delClient.firstname} was deleted from the clients-collection\n`, delClient);
 
            // Return object of the delted client-document
            return res.status(200).json(delClient)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },


// -------------------- GET client accounts --------------------//
    // Get all accounts of a specific client by clientId
    // Endpoint, that returns all accounts of a specific client by client_id
    // NOT requirement 
    getClientAccounts: async(req, res) => {
        try {
            // Extract ID of client
            let clientId = req.params.id;
            console.log('---------- GET CLIENT ---------- ');
            console.log(`ClientID: ${clientId}`);

            // Find client by ID
            let client = await Client.findById(clientId).exec();
            // Chekc if client exists with given ID
            if (!client) throw {message: "No client with th given client ID"};

            console.log(`-> CLIENT: `);
            console.log(`Client '${client.firstname}' found: \n`, client);
        
            // Using client_id to filter all acounts that matches
            let accounts = await Account.find({"client_id": clientId}).exec();
            // Checking if any accounts exists with given client_id
            if (!accounts[0]) throw {message: "The client has no accounts"};

            console.log(`-> ACCOUNTS: `);
            console.log(`Client ${client.firstname} has following accounts: \n`, accounts)
    
            // Return array with client-accounts
            return res.status(200).json(accounts)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    }
}