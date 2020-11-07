const accountModel = require("../models/account");

// Endpoint to update the balance of an excisting account


// Using the account ID
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