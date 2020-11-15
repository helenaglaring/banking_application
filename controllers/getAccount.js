const accountModel = require("../models/account");

// Get a specific account
// Implementing an endpoint, that will be able to return a specific account by id.

// Finding a specific account by ID
module.exports = async(req, res) => {
    try {
        let accountId = req.params.id;
        console.log('---------- GET ACCOUNT ---------- ');
        console.log(`AccountID: ${accountId}`);

        let account = await accountModel.findById(accountId).exec();

        let message = `Customer ${account.alias} has following account: `;
        console.log(`-> ACCOUNT: `);
        console.log(message);
        console.log(account);

        res.json({
            account
        })

    } catch (err) {
        console.log({ message: err })
    }
};


/* ALTERNATIVE: Find by firstName (not quite appropriate if more accounts with same firstName)
module.exports = async(req, res) => {
    try {
        let accountHolder = req.params.id;
        console.log('---------- GET ACCOUNT BALANCE ---------- ');
        console.log(`Search-parameter: ${accountHolder}`);

        let account = await accountModel.findOne({firstName: accountHolder}).exec();
        console.log(`Account of customer ${account.firstName} found: `);
        console.log(account);

        let message = `Customer ${account.firstName} has an account with the balance: ${account.balance} kr.`;
        console.log(`-> ACCOUNT BALANCE: `);
        console.log(message);

        res.json(message)

    } catch (err) {
        console.log({ message: err })
    }
};
*/