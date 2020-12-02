const Account = require('../models/account');
const Client = require('../models/client');
const transactionsModel = require('../models/transactions');

const db = require("../db.js");
const mongoose = require('mongoose');

// https://github.com/jeffreynerona/node-bank/blob/master/routes/register.js
// save og exec

/*
getAccounts         // GET all accounts
getAccount          // GET account
getAccountBalance   // GET account balance
createAccount       // CREATE new account
updateBalance       // UPDATE account balance
deleteAccount       // DELETE account
transfer            // UPDATE 2 account balances

*/


module.exports = {

// -------------------- GET all accounts --------------------//
    // Endpoint that returns a list with all accounts in the collection     
    getAccounts: async(req, res) => {
        try {
            // Using .find() to return all documents in the accounts-collection. Returns an array.
            let accounts = await Account.find().exec();
            console.log('---------- ALL ACCOUNTS ---------- \n', accounts);
          
            // Checking if the array contains any accounts
            // Needs to push into array - else test fails since it checks if response is an array
            if(!accounts[0]) accounts.push("No accounts found")
            
            // Return array with account-documents
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
            // extracting customer info
            const { client_id, balance, alias} = req.body;   

            // Finding client by ID to get alias, which is client's first name
            const client = await Client.findById(client_id).exec();

            // Checking if clientId exists in the client collection
            if(!client) throw { message: "No client with the given client_id"}

            console.log(`Client with client_id ${client.id} found: `, client);
            
            let newAccount = await Account.create({
                client_id: client_id,
                balance: balance,
                alias:  alias ? alias.trim() : alias // making sure there is no white spaces
            });

            // Save 
            let newAccountSaved =  await newAccount.save();
    
            console.log('---------- NEW ACCOUNT ---------- ');
            console.log("New account created: ", newAccountSaved);

            // Return newly created account-document
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
        
            console.log('---------- GET ACCOUNT ---------- ');
            console.log(`AccountID: ${accountId}`);

            // Find account by accountId
            let account = await Account.findById(accountId).exec();

            // Checking if account exists with given Id
            if(!account) throw { message: "No account found with the given accountId" }

            console.log(`-> ACCOUNT: `);
            console.log(`Following account was found: `, account);
           
            // Return account-object in response
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

            // Find account with given accountId
            let account = await Account.findById(accountId).exec();

            // Checking if account exists with given Id
            if (!account) throw {message: "No account matches the given accountId"}

            console.log(`Account found: `, account);
         

            console.log(`-> ACCOUNT BALANCE: `);
            console.log({"balance": account.balance})
            
            // Return balance of account
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

            let {balance, alias} = req.body; // extracting account info


            console.log('---------- GET ACCOUNT BALANCE ---------- ');
            console.log(`AccountID: ${accountId}`);

            // Finding the 'original' account by the account ID
            let originalAccount = await Account.findById(accountId).exec();

            // Checking if there is an account with the given accountID sent with the request
            // Else throw error
            if (!originalAccount) throw {message: "No account found with the given ID"}

            console.log(`Account found: `, originalAccount);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${originalAccount.balance} kr. `);

            // Update excisting account using the findByIdAndUpdate.
            let updAccount = await Account.findByIdAndUpdate(accountId, 
                // Using logical AND-operator to make sure to update the properties that are sent in req.body.
                // Else it needs to set the property-value to the original value.
                { $set: {
                    "balance" : balance || originalAccount.balance, 
                    "alias": alias ? alias.trim() : alias || originalAccount.alias 
                }},
                // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
                { new: true, useFindAndModify: false} ).exec();
            
            // Save document. But not needed with findByIdAndUpdate.
            let updAccountSaved = await updAccount.save();

            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            console.log(`Account balance was updated from: ${originalAccount.balance} kr to ${updAccount.balance} kr`, updAccountSaved);

            // Returning response with the object of the updated account
            return res.status(200).json(updAccountSaved)

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

            // Checking if account with given ID exists, else throw error
            if(!account) throw { message: "No account with the given account ID"}
            console.log(`Account was found: `, account);
       
            // Delete excisting account using the findByIdAndDelete.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let delAccount = await Account.findByIdAndDelete(accountId).exec(); 
            
            if(!delAccount) throw { message: "Deletion unsuccesful: No account with the given account ID was deleted"}

            console.log(`-> ACCOUNT WAS DELETED: `);
            console.log(`The account was deleted from the accounts-collection: `, delAccount);

            // Returning response containing the deleted account-object
            return res.status(200).json(delAccount)

        } catch (err) {
            console.log(err)
            return res.status(404).json(err.message);
        }
    },


    // -------------------- TRANSFER --------------------//
// Problem: the version needed of mongoose fails
// Transaction implementation
// https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions

    // Endpoint to transfer money from one account to another
    transfer: async(req, res) => {
        try {
            const {fromAccount, toAccount, amount } = req.body;
            console.log('---------- TRANSACTION FROM ---------- ');
            console.log(`fromAccountID ${fromAccount}`);
            // Finding the account from which we are transfering money from
            let from = await Account.findById(fromAccount).exec();
            if(!from) throw { message: "Can't find ID on 'from'-account"}

            console.log(`Account of customer ${from.alias} found: `, from);
            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);


            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`toAccountID: ${toAccount}`);
            // Finding the account from which we are transfering money from
            let to = await Account.findById(toAccount).exec();
            if(!to) throw { message: "Can't find ID on 'to'-account"}
            console.log(`Account of customer ${to.alias} found: `, to);
            console.log(`-> INITIAL ACCOUNT BALANCE: ${to.balance} kr. `);

             // --------- Check balance ----------//
            if(from.balance-amount<0) throw { message: 'Not enough money on the account to execute the transaction'}


            console.log('---------- TRANSACTION... ---------- ');
            // --------- TRANSACTION FROM ----------//
            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccountFrom = await Account.findByIdAndUpdate(
                fromAccount, // value of _id to query by
                { $inc: {"balance": -1* amount }},  // update: decrease by amount
                { // options
                new: true, // return new updated object
                useFindAndModify: false
            }).exec()

            if(!updAccountFrom) throw { message: 'Transaction canceled - Update of "from account" failed'}
            
            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            let updMessageFrom = `Customer ${updAccountFrom.alias}s account balance was updated from: ${from.balance} kr to ${updAccountFrom.balance} kr`
            console.log(updMessageFrom, updAccountFrom);
        
            // --------- TRANSACTION TO ----------//
            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccountTo = await Account.findByIdAndUpdate(
                toAccount, 
                { $inc: {"balance": +1 * amount} },
                {
                new: true,
                useFindAndModify: false
            }).exec();

            if(!updAccountTo) throw { message: 'update to account went wrong'}

            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            let updMessageTo = `Customer ${updAccountTo.alias}s account balance was updated from: ${to.balance} kr to ${updAccountTo.balance} kr`
            console.log(updMessageTo, updAccountTo);
            
        
            console.log("Transaction was succesfully completed")

            return res.status(200).json({updMessageFrom, updAccountFrom, updMessageTo,updAccountTo })

        } catch(err){
            console.log('---------- TRANSACTION FAILED ---------- ');
            console.log(err)
            return res.status(404).json(err.message);
        } // end try 
    }
    //https://stackoverflow.com/questions/59461391/clientsession-cannot-be-serialized-to-bson
    
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

            console.log(`Account of customer ${from.alias} found: `, from);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);


            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`ID of account holder: ${toAccount}`);
            // Finding the account from which we are transfering money from

            let to = await Account.findById(toAccount).exec();

            console.log(`Account of customer ${to.alias} found: `, to);

            console.log(`-> INITIAL ACCOUNT BALANCE: ${to.balance} kr. `);


            console.log('---------- CHECKING IF TRANSACTION CAN BE DONE ---------- ');
            let updBalanceFrom = from.balance-amount;


            if (updBalanceFrom<0) {
                console.log('---------- TRANSACTION CANCELLED ---------- ');
                let errMsg = `Not enough money on the account to make the transaction`;
                console.log(errMsg);
                return res.json(errMsg)
            } else {
                console.log('---------- TRANSACTION... ---------- ');


                // --------- TRANSACTION FROM ----------//
                // Update excisting account using the findByIdAndUpdate.
                // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
                let updAccountFrom = await Account.findByIdAndUpdate(from.id, 
                    { $set: 
                        {"balance": updBalanceFrom} }, 
                        { new: true, useFindAndModify: false }).exec();

                console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
                let updMessageFrom = `Customer ${updAccountFrom.alias}s account balance was updated from: ${from.balance} kr to ${updAccountFrom.balance} kr`

                console.log(updMessageFrom,updAccountFrom );

                // --------- TRANSACTION TO ----------//
                let updBalanceTo = to.balance + amount;

                // Update excisting account using the findByIdAndUpdate.
                // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
                let updAccountTo = await Account.findByIdAndUpdate(to.id, 
                    { $set: 
                        {"balance": updBalanceTo}}, 
                    { new: true, useFindAndModify: false }).exec();

                console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
                let updMessageTo = `Customer ${updAccountTo.alias}s account balance was updated from: ${to.balance} kr to ${updAccountTo.balance} kr`;
    
                console.log(updMessageTo, updAccountTo);

                return res.status(200).json({updMessageTo, updMessageFrom})
            }

        } catch (err) {
            console.log({ message: err })
            return res.status(404).send("Something went wrong");
        }
    }
};
*/


/*
// -------------------- TRANSFER --------------------//
// With transactionmodel
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
    }
};
*/
/*
// -------------------- TRANSFER --------------------//
// Problem: the version needed of mongoose fails
// Transaction implementation
// https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions

    // Endpoint to transfer money from one account to another
    transfer: async(req, res) => {
        //const session = await mongoose.startSession();
        let session = await mongoose.startSession();

        try {
            const {fromAccount, toAccount, amount } = req.body;
            console.log('---------- TRANSACTION FROM ---------- ');
            console.log(`fromAccountID ${fromAccount}`);
            // Finding the account from which we are transfering money from
            let from = await Account.findById(fromAccount).exec();
            if(!from) throw { message: "Can't find ID on 'from'-account"}

            console.log(`Account of customer ${from.alias} found: `, from);
            console.log(`-> INITIAL ACCOUNT BALANCE: ${from.balance} kr. `);


            console.log('---------- TRANSACTION TO ---------- ');
            console.log(`toAccountID: ${toAccount}`);
            // Finding the account from which we are transfering money from
            let to = await Account.findById(toAccount).exec();
            if(!to) throw { message: "Can't find ID on 'to'-account"}
            console.log(`Account of customer ${to.alias} found: `, to);
            console.log(`-> INITIAL ACCOUNT BALANCE: ${to.balance} kr. `);

            console.log("Starting transaction...")

            
            session.startTransaction()

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
                
                
            if(!updAccountFrom.ok) throw { message: 'update from account went wrong'}
            
            console.log(`-> ACCOUNT BALANCE WAS UPDATED: `);
            let updMessageFrom = `Customer ${updAccountFrom.alias}s account balance was updated from: ${from.balance} kr to ${updAccountFrom.balance} kr`
            console.log(updMessageFrom, updAccountFrom);
        
            // --------- TRANSACTION TO ----------//
            // Update excisting account using the findByIdAndUpdate.
            // Setting options 'new : true' to return the updated object. If not, it returns the original document by default.
            let updAccountTo = await Account.findByIdAndUpdate(
                toAccount, 
                { $inc: {"balance": +1 * amount} }, 
                null,
                {
                new: true,
                useFindAndModify: false,
                session
            }).exec();

            if(!updAccountTo.ok) throw { message: 'update to account went wrong'}
            
            if(from.balance-amount<0) throw { message: 'Not enough money on the account to make the transactio'}

            await session.commitTransaction()
            session.endSession()
            console.log("Transaction was succesfully")

            return res.status(200).json({updMessageTo, updMessageFrom})

        } catch(err){
            console.log('---------- TRANSACTION CANCELLED ---------- ');
            console.error("All operations that has occurred as part of this transaction will be rolled back.");
            console.log("The transaction was aborted due to an unexpected error: " + err);
            console.log(err)
        
            await session.abortTransaction();
            session.endSession()
            return res.status(404).json(err.message);
        } // end try 
    }
    //https://stackoverflow.com/questions/59461391/clientsession-cannot-be-serialized-to-bson
    */
}