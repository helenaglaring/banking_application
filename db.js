/*--db.js-------------------------- Database connection -----------------------------------------------------*/
// In db.js we establish a connection to the mongoDB-database server. The connection is exported, so it is
// available in other files. 

const mongoose = require('mongoose');
const config = require('./config'); // Get database url

let connection;

const getConnection = async () => {
    if (!connection) {
        // Insert the correct db url:
        // The URL should be mongodb://localhost/<database name>, ie. mongodb://localhost/<database name>
        // connection = await mongoose.connect('mongodb://localhost/BankingApp', {
        connection = await mongoose.connect(config.databaseUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
    }
    return connection;
};

module.exports = {
    getConnection: getConnection
};



// Src: https://github.com/DIS-2020/bankingApplication/blob/solution/3_handin_template/db.js