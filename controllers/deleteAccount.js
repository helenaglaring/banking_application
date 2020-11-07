const accountModel = require("../models/account");


// Endpoint to delete an excisting account
// Using the account ID
module.exports = async(req, res) => {
    try {
        let accountId = req.params.id;

        console.log('---------- DELETE ACCOUNT ---------- ');
        console.log(`AccountID: ${accountId}`);

        // Finding the 'original' account by the account ID
        let account = await accountModel.findById(accountId).exec();
        console.log(`Account of customer ${account.alias} found: `);
        console.log(account);

        // Delete excisting account using the findByIdAndDelete.
        // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
        let delAccount = await accountModel.findByIdAndDelete(accountId).exec();

        console.log(`-> ACCOUNT WAS DELETED: `);
        let message = `Customer ${account.alias}'s account was deleted from the accounts-collection`;

        console.log(message);

        res.json(delAccount)

    } catch (err) {
        console.log({ message: err })
    }
};
