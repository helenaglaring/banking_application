const Account = require('../models/account');
const Client = require('../models/client');
const transactionsModel = require('../models/transactions');

const db = require("../db.js");

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
            let accounts = await Account.find().exec();
            console.log('---------- ALL ACCOUNTS ---------- ');
            console.log(accounts);

            if(!accounts[0]) throw {message: "No accounts found"}
    
            return res.status(200).json(accounts)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },

// -------------------- CREATE new account --------------------//
    // Endpoint for adding a new account
    createAccount: async(req, res) => {
        try {
            const { client_id, balance, alias} = req.body;   // extracting customer info

            // Finding client by ID to get alias, which is client's first name
            const client = await Client.findById(client_id).exec();

            // Checking if clientId exists in the client collection
            if(!client) throw { message: "No client with the given client_id"}

            console.log(`Client with client_id ${client.id} found: `);
            console.log(client)
            
            let newAccount = await Account.create({
                client_id: client_id,
                balance: balance,
                alias:  alias ? alias.trim() : alias // making sure there is no white spaces
            });

            console.log('---------- NEW ACCOUNT ---------- ');
            console.log("New account created: ");
            console.log(newAccount)

            return res.status(200).json(newAccount)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },

// -------------------- GET account --------------------//
    // Get a specific account by ID
    // Endpoint, that will be able to return a specific account by id.
    getAccount: async(req, res) => {
        try {
            let accountId = req.params.id;
            console.log(accountId.length)
            console.log('---------- GET ACCOUNT ---------- ');
            console.log(`AccountID: ${accountId}`);

            let account = await Account.findById(accountId).exec();

            if(!account) throw { message: "No account found with the given accountId" }


            console.log(`-> ACCOUNT: `);
            console.log(`Customer ${account.alias} has following account: `);
            console.log(account);

            return res.status(200).json(account)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
            
        }
    },

// -------------------- GET account balance --------------------//
    // Get the balance of a specific account by accountId
    // Endpoint, that will be able to return a specific account-balance by id.
    getAccountBalance: async(req, res) => {
        try {
        
            let accountId = req.params.id;

            console.log('---------- GET ACCOUNT BALANCE ---------- ');
            console.log(`AccountID: ${accountId}`);

            let account = await Account.findById(accountId).exec();
            if (!account) throw {message: "No account matches the given accountId"}

            console.log(`Account of customer ${account.alias} found: `);
            console.log(account);

            console.log(`-> ACCOUNT BALANCE: `);
            console.log({"balance": account.balance})
            

            return res.status(200).json({
                balance: account.balance
            })

        } catch (err) {
            console.log(err);
            return res.status(404).send(err.message);
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
            let {balance, alias} = req.body;

    

            console.log('---------- GET ACCOUNT BALANCE ---------- ');
            console.log(`AccountID: ${accountId}`);

            // Finding the 'original' account by the account ID
            let originalAccount = await Account.findById(accountId).exec();

            // Checking if there is an account with the given accountID sent with the request
            if (!originalAccount) throw {message: "No account found with the given ID"}

            console.log(`Account of customer ${originalAccount.alias} found: `);
            console.log(originalAccount);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${originalAccount.balance} kr. `);

            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccount = await Account.findByIdAndUpdate( accountId, 
                {$set: {
                    "balance" : balance || originalAccount.balance, 
                    "alias": alias ? alias.trim() : alias || originalAccount.alias 
                }},
                
                { new: true, useFindAndModify: false} ).exec();

            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            console.log(`Customer ${updAccount.alias}s account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`);
            console.log(updAccount);

            return res.status(200).json(updAccount)

        

        } catch (err) {
            console.log({ message: err })
            return res.status(404).json(err.message);
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
            let account = await Account.findById(accountId).exec();
            if(!account) throw { message: "No account with the given account ID"}

            console.log(`Account of customer ${account.alias} found: `);
            console.log(account);

            // Delete excisting account using the findByIdAndDelete.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let delAccount = await Account.findByIdAndDelete(accountId).exec();

            console.log(`-> ACCOUNT WAS DELETED: `);
            console.log(`Customer ${account.alias}'s account was deleted from the accounts-collection: `);
            console.log(delAccount);

            return res.status(200).json(delAccount)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },
// -------------------- TRANSFER --------------------//
// save?
// https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions

    // Endpoint to transfer money from one account to another
    transfer: async(req, res) => {
        const session = await Account.startSession();
        //const connection = db.getConnection;

        //const session = await connection.startSession();
  

        session.startTransaction()
        console.log("Starting transaction")

        try {
            const transactionResults = await session.withTransaction( async() => {

            })
            //const fromId = req.params.fromId;
            const {fromAccount, toAccount, amount } = req.body;


            console.log('---------- TRANSACTION FROM ---------- ');
            console.log(`fromAccountID ${fromAccount}`);
            // Finding the account from which we are transfering money from
            let from = await Account.findById(fromAccount, {session}).exec();

            console.log(`Account of customer ${from.alias} found: `);
            console.log(from);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);

            

            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`toAccountID: ${toAccount}`);
            // Finding the account from which we are transfering money from
            let to = await Account.findById(toAccount, {session}).exec();

            console.log(`Account of customer ${to.alias} found: `);
            console.log(to);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${to.balance} kr. `);




            console.log('---------- TRANSACTION... ---------- ');

            // --------- TRANSACTION FROM ----------//
            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccountFrom = await Account.findByIdAndUpdate(
                fromAccount, // value of _id to query by
                { $inc: {"balance": -1* amount }},  // update: decrease by amount
                { // options
                new: true, // return new updated object
                useFindAndModify: false,
                session
            }).exec();

            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            let updMessageFrom = `Customer ${updAccountFrom.alias}s account balance was updated from: ${newTransaction.fromAccount.balance} kr to ${updAccountFrom.balance} kr`

            console.log(updMessageFrom);
            console.log(updAccountFrom);


            // --------- TRANSACTION TO ----------//
    

            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccountTo = await Account.findByIdAndUpdate(
                toAccount, 
                { $inc: {"balance": +1 * amount} }, {
                new: true,
                useFindAndModify: false,
                session
            }).exec();

            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            let updMessageTo = `Customer ${updAccountTo.alias}s account balance was updated from: ${to.balance} kr to ${updAccountTo.balance} kr`;

            console.log(updMessageTo);
            console.log(updAccountTo);


            console.log('---------- CHECKING IF TRANSACTION CAN BE DONE ---------- ');

            if (from.balance-amount<0) {
                await session.abortTransaction();
                console.log('---------- TRANSACTION CANCELLED ---------- ');
                let errMsg = `Not enough money on the account to make the transaction`;
                console.log(errMsg);
                console.error("All operations that has occurred as part of this transaction will be rolled back.");
    
                return res.send(errMsg)
            }
            if (transactionResults) {
                console.log("Transaction was succesfully")
                return res.status(200).json({updMessageTo, updMessageFrom, newTransaction})
            } else {
                console.log("The transaction was intentionally aborted")
            }
        } catch(e){
            console.log("The transaction was aborted due to an unexpected error: " + e);
            console.log(e)
            return res.status(404).send("Something went wrong");
        } finally {
            await session.endSession()
        }
    }
    
/*
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
            let from = await Account.findById(fromAccount).exec();

            console.log(`Account of customer ${from.alias} found: `);
            console.log(from);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);

            


            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`ID of account holder: ${toAccount}`);
            // Finding the account from which we are transfering money from
            let to = await Account.findById(toAccount).exec();

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
                let updAccountFrom = await Account.findByIdAndUpdate(newTransaction.fromAccount.id, {"balance": updBalanceFrom}, {
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
                let updAccountTo = await Account.findByIdAndUpdate(to.id, {"balance": updBalanceTo}, {
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
    }*/

};