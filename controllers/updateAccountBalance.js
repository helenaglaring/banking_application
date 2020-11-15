const accountModel = require("../models/account");

// Endpoint to update the balance of an excisting account


// Using the account ID
/*
module.exports = async(req, res) => {
    try {
        let accountId = req.params.id;
        const updBalance = req.body.balance ;   // extracting customer info

        console.log('---------- GET ACCOUNT BALANCE ---------- ');
        console.log(`AccountID: ${accountId}`);

        // Finding the 'original' account by the account ID
        let originalAccount = await accountModel.findById(accountId).exec();
        console.log(`Account of customer ${originalAccount.alias} found: `);
        console.log(originalAccount);

        console.log(`-> INITIAL ACCOUNT BALANCE: ${originalAccount.balance} kr. `);

        // Update excisting account using the findByIdAndUpdate.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let updAccount = await accountModel.findByIdAndUpdate( accountId, {"balance":updBalance || originalAccount.balance}, {new: true, useFindAndModify: false} ).exec();

        console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
        let updMessage = `Customer ${updAccount.alias}s account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`

        console.log(updMessage);
        console.log(updAccount);

        res.json(updAccount)

    } catch (err) {
        console.log({ message: err })
    }
};*/

// FOr test
module.exports = async(req, res) => {
    try {
        let accountId = req.params.id;
        const updBalance = req.body.balance ;   // extracting customer info
        const updAlias = req.body.alias ; 

        console.log('---------- GET ACCOUNT BALANCE ---------- ');
        console.log(`AccountID: ${accountId}`);

        // Finding the 'original' account by the account ID
        let originalAccount = await accountModel.findById(accountId).exec();
        console.log(`Account of customer ${originalAccount.alias} found: `);
        console.log(originalAccount);

        console.log(`-> INITIAL ACCOUNT BALANCE: ${originalAccount.balance} kr. `);

        // Update excisting account using the findByIdAndUpdate.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let updAccount = await accountModel.findByIdAndUpdate( accountId, 
            {
                "balance" : updBalance || originalAccount.balance, 
                "alias": updAlias || originalAccount.alias 
            },
            
            { new: true, useFindAndModify: false} ).exec();

        console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
        let updMessage = `Customer ${updAccount.alias}s account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`

        console.log(updMessage);
        console.log(updAccount);

        res.json(updAccount)

    } catch (err) {
        console.log({ message: err })
    }
};



