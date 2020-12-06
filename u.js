// Endpoint to transfer money from one account to another
transfer: async(req, res) => {
    try {
        const {fromAccount, toAccount, amount } = req.body;
        // Find from and to accounts
        let from = await Account.findById(fromAccount).exec();
        if(!from) throw { message: "Can't find ID on 'from'-account"}

        let to = await Account.findById(toAccount).exec();
        if(!to) throw { message: "Can't find ID on 'to'-account"}

        // --------- Check balance ----------//
        if(from.balance-amount<0) throw { message: 'Not enough money on the account to execute the transaction'}

        // --------- TRANSACTION...----------//
        // Update accounts using the findByIdAndUpdate.
        let updAccountFrom = await Account.findByIdAndUpdate(
            fromAccount, // value of _id to query by
            { $inc: {"balance": -1* amount }},  // update: decrease by amount
            { new: true,  useFindAndModify: false // return new updated object
        }).exec()

        if(!updAccountFrom) throw { message: 'Transaction canceled - Update of "from account" failed'}
    
        let updAccountTo = await Account.findByIdAndUpdate(
            toAccount, 
            { $inc: {"balance": +1 * amount} },
            { new: true, useFindAndModify: false
        }).exec();
        if(!updAccountTo) throw { message: 'update to account went wrong'}

        return res.status(200).json({updAccountFrom, updAccountTo })
    } catch(err){
        console.log('---------- TRANSACTION FAILED ---------- ');
        console.log(err)
        return res.status(404).json(err.message);
    } 
}



// -------------------- TRANSFER --------------------//
// Transaction implementation
    // Endpoint to transfer money from one account to another
    transfer: async(req, res) => {
        let session = await mongoose.startSession();

        try {
            const {fromAccount, toAccount, amount } = req.body;

            // Finding the account from which we are transfering money from
            let from = await Account.findById(fromAccount).exec();
            if(!from) throw { message: "Can't find ID on 'from'-account"}

            // Finding the account from which we are transfering money from
            let to = await Account.findById(toAccount).exec();
            if(!to) throw { message: "Can't find ID on 'to'-account"}

            session.startTransaction()
            // Transaction from
            let updAccountFrom = await Account.findByIdAndUpdate(
                fromAccount, // value of _id to query by
                { $inc: {"balance": -1* amount }}, null,  // update: decrease by amount
                {  new: true,useFindAndModify: false, session}).exec();
                
            if(!updAccountFrom.ok) throw { message: 'update from account went wrong'}

            // Transaction to
            let updAccountTo = await Account.findByIdAndUpdate(
                toAccount, 
                { $inc: {"balance": +1 * amount} }, null,
                { new: true,useFindAndModify: false,session}).exec();

            if(!updAccountTo.ok) throw { message: 'update to account went wrong'}
            // Check balance
            if(from.balance-amount<0) throw { message: 'Not enough money on the account to make the transactio'}
            // Commit transaction
            await session.commitTransaction()
            session.endSession()

            return res.status(200).json({updMessageTo, updMessageFrom})

        } catch(err){
            // Transaction failed - roll back
            console.log(err)
            await session.abortTransaction();
            session.endSession()
            return res.status(404).json(err.message);
        } 
    }

    // https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions

    //https://stackoverflow.com/questions/59461391/clientsession-cannot-be-serialized-to-bson
    