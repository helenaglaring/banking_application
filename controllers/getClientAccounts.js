const clientModel = require("../models/client");
const accountModel = require("../models/account");

// Get all accounts of a specific client
// Implementing an endpoint, that will be able to return all accounts of a specific client by client_id

// Finding a specific client's accounts by ID
module.exports = async(req, res) => {
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
            message,
            accounts
        })

    } catch (err) {
        console.log({ message: err })
    }
};