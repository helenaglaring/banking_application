const clientModel = require("../models/client");
const accountModel = require("../models/account");

// Endpoint to update the information of an excisting client
// Todo: Change alias in account with same client ID

// Using the client ID
module.exports = async(req, res) => {
    try {
        let clientId = req.params.id;
        const {firstname, lastname, street_name, city} = req.body; // extracting customer info

       
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
            street_name: street_name || originalClient.street_name,
            city: city || originalClient.city
        }
        console.log("New client object")
        console.log(newClient);


        // Update excisting client using the findByIdAndUpdate.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let updClient = await clientModel.findByIdAndUpdate(clientId, newClient, {new: true, useFindAndModify: false} ).exec();

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
};



/*
// Using the firstName of the account holder as search parameter
module.exports = async(req, res) => {
    try {
        let accountHolder = req.params.id;
        const updBalance = req.body.balance;   // extracting customer info

        console.log('---------- GET ACCOUNT BALANCE ---------- ');
        console.log(`Account holder: ${accountHolder}`);

        // Finding the 'original' account by the account ID
        let originalAccount = await accountModel.findOne({firstName: accountHolder}).exec();
        console.log(`Account of customer ${originalAccount.firstName} found: `);
        console.log(originalAccount);

        console.log(`-> INITIAL ACCOUNT BALANCE: ${originalAccount.balance} kr. `);

        // Update excisting account using the findByIdAndUpdate.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let updAccount = await accountModel.findOneAndUpdate( {"firstName":accountHolder}, {"balance":updBalance}, {new: true, useFindAndModify: false} ).exec();

        console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
        let updMessage = `Customer ${updAccount.firstName}s account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`

        console.log(updMessage);
        console.log(updAccount);

        res.json({
            updMessage,
            updAccount
        })

    } catch (err) {
        console.log({ message: err })
    }
};
*/