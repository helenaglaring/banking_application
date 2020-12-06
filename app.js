
/*--app.js-------------------------- APP configuration -----------------------------------------------------*/
// In app.js we create our server application, to which the load balancer forwards client requests.

const express = require('express');
const mongoose = require('mongoose'); //5.10.12

// Node.js body parsing middleware.
// Used to parse incoming request bodies in a middleware before our handlers. Available in the 'req.body'-property.
const bodyParser = require('body-parser');

// Implmenting modules to use for secure communication through HTTPS (SSL/TLS)
// Importing Node.js' built-in HTTPS-module, that allows Node.js to transfer data via 'Hyper Text Transfer Protocol Secure' (HTTPS).
const https = require('https');
const path = require('path');
const fs = require('fs');

// Creating an options-object containing the self-signed certificate and private key we need for establishing the SSL connection over HTTPS
// Creating the 'options'-object containing the path to the private key and certifikate
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),  // The private key
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')) // The certificate
}

// Importing the database connection
const db = require("./db.js");

// Importing routes
const accountRoute = require('./routes/accounts');
const clientRoute = require('./routes/clients.js');


// Importing the 'seaport'-module, that is a service-register and used to distributing requests to specific ports.
const seaport = require('seaport');

// Creating a seaport instance connected to a TCP-connection. Declaring the varriable 'ports' containing the seaport-objct.
// From this seaport-instance the severs are registred. 
const ports = seaport.connect('localhost', 9090);

// express() returns af function, designed to be passed to HTTP and HTTPS servers as a callback to handle requestes.
const app = express();


/*
//DB connection
mongoose.connect('mongodb://localhost/BankingApp', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true},() => 
            
            console.log("---------- DATABSE CONNECTED ----------\nDatabase is connected")
)
*/

// Added Json Body-parser
// Returns middleware that only parses json. Only looks at requests where Content-Type-header matches the type option.
app.use(bodyParser.json()); // Telling our system to use JSON. https://stackoverflow.com/questions/39870867/what-does-app-usebodyparser-json-do
// Setting 'extended: true', so we can parse nested objects, not only strings or arrays.
app.use(bodyParser.urlencoded({ extended: true }));

// Implementing routes
app.use('/accounts', accountRoute);
app.use('/clients', clientRoute);

// Initial route
app.get('/', (req, res) => {
    // Get port on which the specific server is running
    let port = req.socket.address().port;
    console.log('---------- Server received client request ----------');
    console.log(`Server with port: ${port} received a request`);

    // Sending client response with the port of the server, that the load balancer forwarded the request to
    console.log('---------- Server has sent client response ----------');

    res.send('Welcome to the banking app - Response from server on port: ' + port);
});

// The HTTPS-module's createServer-method creates a new server-instance
// We pass in the httpsOptions-object containing self-signed certificate and public key
// and pass in our express-app as the requestlistener or callback function. 
const httpsServer = https.createServer(httpsOptions, app);


// Starts the HTTPS server to listen for encrypted connections
// We register our express server in seaport - the port will differentiate each time a server is initiatd.
httpsServer.listen(ports.register('server'), function() {
    // Connecting to our mongoDB-database
    db.getConnection().then(
        console.log("---------- DATABSE ----------\nDatabase is connected")
    
    );
    console.log('---------- SERVER ----------');
    console.log('Server listening on port %d', this.address().port);
    console.log(this.address())
});

// The load balancer will forward client requests to the respective server's port.


// Src: http://expressjs.com/en/api.html#app.listen