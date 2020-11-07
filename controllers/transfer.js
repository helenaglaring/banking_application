const accountModel = require("../models/account");
const transactionsModel = require("../models/transactions");


// Lav en model - transaction
// To, from, amount
// req.body.to
// req.body.from
// lav kald i databasen


// Using the firstName of the account holder as search parameter
module.exports = async(req, res) => {
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

            res.json({updMessageTo, updMessageFrom, newTransaction})
        }

    } catch (err) {
        console.log({ message: err })
    }
};


