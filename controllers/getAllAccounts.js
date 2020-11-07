const accountModel = require("../models/account");

// Getting a list with all accounts 
// Endpoint that returns a list with all accounts in the collection

module.exports = async(req, res) => {
    try {
        // Using .find() to return all documents in the accounts-collection
        let accounts = await accountModel.find().exec();
        console.log('---------- ALL ACCOUNTS ---------- ');
        console.log(accounts);

        res.json(accounts)
    } catch (err) {
        console.log({ message: err })
    }
};
