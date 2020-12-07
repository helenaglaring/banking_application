
// node populatedb mongodb://localhost/BankingApp
console.log('This script populates some test client, and account instances to the database. Specified database as argument - e.g.: populatedb mongodb://localhost/BankingApp');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Client = require('./models/client')
var Account = require('./models/account')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var clients = []
var accounts = []


const clearDB = async () => {
  Object.keys(mongoose.connection.collections).forEach(async key => {
   await mongoose.connection.collections[key].deleteMany({});
  });
 }

function clientCreate(firstname, lastname, streetAddress, city, cb) {
  clientdetail = {firstname:firstname , lastname: lastname, streetAddress: streetAddress, city: city }
  
  var client = new Client(clientdetail);
       
  client.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Client: ' + client);
    clients.push(client)
    cb(null, client)
  }  );
}


function accountCreate(client_id, balance, alias, cb) {

  accountdetail = { 
    client_id: client_id,
    balance: balance,
    alias: alias
  }

  var account = new Account(accountdetail); 

  account.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Account: ' + account);
    accounts.push(account)
    cb(null, account)
  }  );
}


function createClients(cb) {
    async.series([
        function(callback) {
          clientCreate('Helena', 'Glaring', 'Hvidkildevej 4', 'København NV', callback);
        },
        function(callback) {
          clientCreate('Freja', 'Borly', 'Brønshøjvej 11', 'Brønshøj', callback);
        },
        function(callback) {
          clientCreate('Tina', 'Glaring', 'Bakkevolden 1', 'Greve', callback);
        },
        function(callback) {
          clientCreate('Lars', 'Nielsen', 'Bakkevolden 1', 'Greve', callback);
        },
        function(callback) {
          clientCreate('Michael', 'Nielsen', 'Hvidkildevej 4', 'København NV', callback);
        },
        function(callback) {
          clientCreate('Joy', 'Inchamrat', 'Hvidkildevej 4', 'København NV', callback);
        },
        function(callback) {
          clientCreate('Morten', 'Nielsen', 'Torveporten 4', 'Valby', callback);
        },
        function(callback) {
          clientCreate('Mona', 'Leufstedt', 'Torveporten 4', 'Valby', callback);
        },
        function(callback) {
          clientCreate('Alfred Leufstedt', 'Nielsen', 'Torveporten 4', 'Valby', callback);
        },
        function(callback) {
          clientCreate('Amalie Helia' ,'Larsen', 'Fuglebakkevej', 'Frederiksberg', callback);
        },
        
        ],
        // optional callback
        cb);
}


function createAccounts(cb) {
    async.parallel([
        function(callback) {
          accountCreate(clients[0].id, 1000, 'Helenas konto', callback);
        },
        function(callback) {
          accountCreate(clients[1].id, 2000, 'Frejas konto', callback);
        },
        function(callback) {
          accountCreate(clients[2].id, 3000, 'Mors konto', callback);
        },
        function(callback) {
          accountCreate(clients[3].id, 4000, 'Lars\'s konto', callback);
        },
        function(callback) {
          accountCreate(clients[4].id, 5000, 'Michaels konto', callback);
        },
        function(callback) {
          accountCreate(clients[5].id, 6000, 'Joys konto', callback);
        },
        function(callback) {
          accountCreate(clients[6].id, 7000, 'Mortens konto', callback);
        },
        function(callback) {
          accountCreate(clients[7].id, 8000, 'Monas konto', callback);
        },
        function(callback) {
          accountCreate(clients[8].id, 9000, 'Alfreds konto', callback);
        },
        function(callback) {
          accountCreate(clients[9].id, 10000, 'Amalies konto', callback);
        },
        ],
        // optional callback
        cb);
}


//dropAllDocuments();
clearDB()

async.series([
    createClients,
    createAccounts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('\nCLIENTinstances: '+ clients);
        console.log('\nACCOUNTinstances: '+ accounts);
        
    }
    // Done, disconnect from database
    mongoose.connection.close();
});



// src: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose