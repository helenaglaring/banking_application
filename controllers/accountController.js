const accountModel = require('../models/account');
const clientModel = require('../models/client');
const transactionsModel = require('../models/transactions');
const clientAuthMiddleware = require('../middleware/clientAuth');

/*
getAccounts         // GET all accounts
getAccount          // GET account
getAccountBalance   // GET account balance
createAccount       // CREATE new account
updateBalance       // UPDATE account balance
deleteAccount       // DELETE account
transfer            // UPDATE 2 account balances

*/

// Todo: save() ved update wait toaccount.save(), fromAccount.save


module.exports = {

// -------------------- GET all accounts --------------------//
    // Getting a list with all accounts 
    // Endpoint that returns a list with all accounts in the collection     
    getAccounts: async(req, res) => {
        try {
            // Using .find() to return all documents in the accounts-collection
            let accounts = await accountModel.find().exec();
            console.log('---------- ALL ACCOUNTS ---------- ');
            console.log(accounts);
    
            return res.status(200).json(accounts)

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("Account not found");
        }
    },

// -------------------- CREATE new account --------------------//
    // Endpoint for adding a new account
    createAccount: async(req, res) => {
        try {
            const { client_id, balance, alias} = req.body;   // extracting customer info
            console.log(req.body)

            // Finding client by ID to get alias, which is client's first name
            const client = await clientModel.findById(client_id).exec();

            console.log(`Client with client_id ${client.id} found: `);
            console.log(client)


            let newAccount = await accountModel.create({
                client_id: client_id,
                balance: balance,
                alias: alias
            });

            console.log('---------- NEW ACCOUNT ---------- ');
            console.log("New account created: ");
            console.log(newAccount)

            return res.status(200).json(newAccount)

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send(err.message);
        }
    },

// -------------------- GET account --------------------//
    // Get a specific account by ID
    // Endpoint, that will be able to return a specific account by id.
    getAccount: async(req, res) => {
        try {
            let accountId = req.params.id;
            console.log('---------- GET ACCOUNT ---------- ');
            console.log(`AccountID: ${accountId}`);

            let account = await accountModel.findById(accountId).exec();

            if(!account) throw "No account found"


            console.log(`-> ACCOUNT: `);
            console.log(`Customer ${account.alias} has following account: `);
            console.log(account);

            return res.status(200).json(account)

        } catch (err) {
            //console.log("fejl")
            console.log({ message: err })
            return res.status(404).send(err);
            
        }
    },


// -------------------- GET account balance --------------------//
    // Get the balance of a specific account by accountId
    // Endpoint, that will be able to return a specific account-balance by id.
    getAccountBalance: async(req, res) => {
        try {
        
            let accountId = req.params.id;
            let errMsg;

            console.log('---------- GET ACCOUNT BALANCE ---------- ');
            console.log(`AccountID: ${accountId}`);

            let account = await accountModel.findById(accountId).exec();
            if (!account) throw "No account matches the given accountId"

            console.log(`Account of customer ${account.alias} found: `);
            console.log(account);

            console.log(`-> ACCOUNT BALANCE: `);
            console.log({"balance": account.balance})
            

            return res.status(200).json({
                balance: account.balance
            })

        } catch (err) {
            console.log({ message: err });
            return res.status(404).send(err);
        }
    },

// -------------------- UPDATE account balance --------------------//
    // Endpoint to update the balance of an excisting account using accountId
    // For test
    updateAccountBalance: async(req, res) => {
        try {
            let accountId = req.params.id;
            const updBalance = req.body.balance ;   // extracting customer info
            const updAlias = req.body.alias ; 

            console.log('---------- GET ACCOUNT BALANCE ---------- ');
            console.log(`AccountID: ${accountId}`);

            // Finding the 'original' account by the account ID
            let originalAccount = await accountModel.findById(accountId).exec();

            // Checking if there is an account with the given accountID sent with the request
            if (!originalAccount) throw "No account found with the given ID"

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
            console.log(`Customer ${updAccount.alias}s account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`);
            console.log(updAccount);

            return res.status(200).json(updAccount)

        

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send(err);
        }
    },

// -------------------- DELETE account --------------------//
    // Endpoint to delete an excisting account by accountId
    deleteAccount: async(req, res) => {
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
            console.log(`Customer ${account.alias}'s account was deleted from the accounts-collection: `);
            console.log(delAccount);

            return res.status(200).json(delAccount)

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("No account with the given ID");
        }
    },

// -------------------- TRANSFER --------------------//
// save?
    // Endpoint to transfer money from one account to another
    transfer: async(req, res) => {
        try {
            //const fromId = req.params.fromId;
            const {fromAccount, toAccount, amount } = req.body;


            console.log('---------- TRANSACTION FROM ---------- ');
            console.log(`ID of account holder: ${fromAccount}`);

            // Finding the account from which we are transfering money from
            let from = await accountModel.findById(fromAccount).exec();

            console.log(`Account of customer ${from.alias} found: `);
            console.log(from);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);

            


            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`ID of account holder: ${toAccount}`);
            // Finding the account from which we are transfering money from
            let to = await accountModel.findById(toAccount).exec();

            console.log(`Account of customer ${to.alias} found: `);
            console.log(to);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${to.balance} kr. `);


            console.log('---------- CHECKING IF TRANSACTION CAN BE DONE ---------- ');
            let updBalanceFrom = from.balance-amount;

            if (updBalanceFrom<0) {
                console.log('---------- TRANSACTION CANCELLED ---------- ');
                let errMsg = `Not enough money on the account to make the transaction`;
                console.log(errMsg);
                res.send(errMsg)
            } else {
                console.log('---------- TRANSACTION... ---------- ');

                let newTransaction = await transactionsModel.create({
                    fromAccount: from,
                    toAccount: to,
                    amount: amount
                });
                console.log(" -> Making following transaction: ");
                console.log(newTransaction);

                // --------- TRANSACTION FROM ----------//
                // Update excisting account using the findByIdAndUpdate.
                // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
                let updAccountFrom = await accountModel.findByIdAndUpdate(newTransaction.fromAccount.id, {"balance": updBalanceFrom}, {
                    new: true,
                    useFindAndModify: false
                }).exec();

                console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
                let updMessageFrom = `Customer ${updAccountFrom.alias}s account balance was updated from: ${newTransaction.fromAccount.balance} kr to ${updAccountFrom.balance} kr`

                console.log(updMessageFrom);
                console.log(updAccountFrom);
                // --------- TRANSACTION TO ----------//
                let updBalanceTo = to.balance + amount;

                // Update excisting account using the findByIdAndUpdate.
                // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
                let updAccountTo = await accountModel.findByIdAndUpdate(to.id, {"balance": updBalanceTo}, {
                    new: true,
                    useFindAndModify: false
                }).exec();

                console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
                let updMessageTo = `Customer ${updAccountTo.alias}s account balance was updated from: ${to.balance} kr to ${updAccountTo.balance} kr`;
    
                console.log(updMessageTo);
                console.log(updAccountTo);

                return res.status(200).json({updMessageTo, updMessageFrom, newTransaction})
            }

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("Something went wrong");
        }
    }

};