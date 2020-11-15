const accountModel = require("../models/account");
const clientModel = require("../models/client");

// Endpoint for adding a new account

/*
module.exports = async(req, res) => {

    try {
        const { client_id, balance} = req.body;   // extracting customer info
        console.log(req.body)

        // Finding client by ID to get alias, which is client's first name
        const client = await clientModel.findById(client_id).exec();
    
        console.log(client)
        console.log(`Client with client_id ${client.id} found: `);


        let newAccount = await accountModel.create({
            client_id: client_id,
            balance: balance,
            alias: client.firstname
        });


        console.log('---------- NEW ACCOUNT ---------- ');
        let message = "New account created: ";
        console.log(message);
        console.log(newAccount);

        res.json(newAccount)

    } catch (err) {
        console.log({ message: err })
    }
};
*/


module.exports = async(req, res) => {

    try {
        const { client_id, balance, alias} = req.body;   // extracting customer info
        console.log(req.body)

        // Finding client by ID to get alias, which is client's first name
        const client = await clientModel.findById(client_id).exec();
    
        console.log(client)
        console.log(`Client with client_id ${client.id} found: `);


        let newAccount = await accountModel.create({
            client_id: client_id,
            balance: balance,
            alias: alias
        });


        console.log('---------- NEW ACCOUNT ---------- ');
        let message = "New account created: ";
        console.log(message);
        console.log(newAccount);

        res.json(newAccount)

    } catch (err) {
        console.log({ message: err })
    }
};