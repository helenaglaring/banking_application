/* Loadbalancer virker med http . IKKE https
I server.js laver vi vores server, som load balanceren videresender client requests til.
Vi tilføjer serveren den funktion at lægge alle tal op til 100.000 sammen, og sende summen
samt serverens portnummer som respons til klienten, så klienten ved, hvilken server den modtager svar fra
 */
const express = require('express');
const app = express();
const mongoose = require('mongoose'); //5.10.12
const bodyParser = require('body-parser');

// Implmenting modules to use for https (ssl)
// Importing Node.js' built-in HTTPS-module, that allows Node.js to transfer data via 'Hyper Text Transfer Protocol Secure' (HTTPS).
const https = require('https');
const path = require('path');
const fs = require('fs');

// Options for https > certifikate and private key
// Creating the 'options'-object containing the path to the private key and certifikate
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}

// Importing the database connection
const db = require("./db.js");

//Import Routes
const accountRoute = require('./routes/accounts');
const clientRoute = require('./routes/clients.js');


// Importing the 'seaport'-module, that is a service-register and used to distributing requests to specific ports.
const seaport = require('seaport');

// Creating a seaport instance connected to a TCP-connection. Declaring the varriable 'ports' containing the seaport-objct.
// From this seaport-instance the severs are registred. 
const ports = seaport.connect('localhost', 9090);


/*
//DB connection
mongoose.connect('mongodb://localhost/BankingApp', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true},() => 
            
            console.log("---------- DATABSE CONNECTED ----------\nDatabase is connected")
)
*/


//Added Json Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Implementing routes
app.use('/accounts', accountRoute);
app.use('/clients', clientRoute);


/*
app.use('/', (req, res) => {
    console.log('---------- Server received client request ----------');
    console.log(`Server with port: ${this.address().port} received a message`);

    // Sender respons til klient
    console.log('---------- Server has sent client response ----------');
})*/


//Initial route
app.get('/', (req, res) => {
    let port = req.socket.address().port;
    console.log('---------- Server received client request ----------');
    console.log(`Server with port: ${port} received a message`);

    // Sender respons til klient
    console.log('---------- Server has sent client response ----------');

    res.send('Welcome to the banking app - Response from server on port: ' + port);
});



// Tilføjer server til seaport - portene vil differentiere fra server til server.
// The HTTPS-module's createServer-method creates a new server-instance, that listens to specific ports and sends a response to the client.
// We place a call back function, which contains the app-object. 
const httpsServer = https.createServer(options, app);


//Implementing SSL > sslServer start listening
httpsServer.listen(ports.register('server'), function() {
    db.getConnection().then(
        console.log("---------- DATABSE CONNECTED ----------\nDatabase is connected")
    
    );
    console.log('---------- SERVER LISTENING  ----------');
    console.log('Server listening on port %d', this.address().port);
    console.log(this.address())
});

// Funktionen i createServer-metoden eksekveres, når nogen forsøger at tilgå computeren på den pågældende port.
// I dette tilfælde, når loadbalancer videresender en client-request til pågældende servers port.
// I browser: localhost:8080 ELLER curl http://localhost:8000
