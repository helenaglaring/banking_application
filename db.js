const mongoose = require('mongoose');

let connection;


const getConnection = async () => {
    if (!connection) {
        // 2. Insert the correct db url
        // Your URL should be mongodb://localhost/<database name>, ie. mongodb://localhost/<database name>
        connection = await mongoose.connect('mongodb://localhost/BankingApp', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
    }
    return connection;
};

//mongoose.connection._connectionString



module.exports = {
    getConnection: getConnection
};


// Kilde: https://github.com/DIS-2020/bankingApplication/blob/solution/3_handin_template/db.js