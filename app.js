/* Loadbalancer virker med http . IKKE https
I server.js laver vi vores server, som load balanceren videresender client requests til.
Vi tilføjer serveren den funktion at lægge alle tal op til 100.000 sammen, og sende summen
samt serverens portnummer som respons til klienten, så klienten ved, hvilken server den modtager svar fra
 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');

// Implmenting modules to use for https (ssl)
// Importing Node.js' built-in HTTPS-module, that allows Node.js to transfer data via 'Hyper Text Transfer Protocol Secure' (HTTPS).
const https = require('https');
const path = require('path');
const fs = require('fs');

// Importing the database connection
const db = require("./db.js");


// Importing the 'seaport'-module, that is a service-register and used to distributing requests to specific ports.
const seaport = require('seaport');


// Creating a seaport instance connected to a TCP-connection. Declaring the varriable 'ports' containing the seaport-objct.
// From this seaport-instance the severs are registred. 
const ports = seaport.connect('localhost', 9090);

const clientAuthMiddleware = require('./middleware/clientAuth');

//Added Json Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import Routes
const accountRoute = require('./routes/accounts');
const clientRoute = require('./routes/clients.js');

app.use('/accounts', accountRoute);
app.use('/clients', clientRoute);
/*
app.use('/', (req, res) => {
    console.log('---------- Server received client request ----------');
    console.log(`Server with port: ${this.address().port} received a message`);

    // Sender respons til klient
    console.log('---------- Server has sent client response ----------');
})*/

// Middleware for client authentication
//app.use(clientAuthMiddleware);

//Initial route
app.get('/', (req, res) => {
    let port = req.socket.address().port;
    console.log('---------- Server received client request ----------');
    console.log(`Server with port: ${port} received a message`);

    // Sender respons til klient
    console.log('---------- Server has sent client response ----------');

    res.send('Welcome to the banking app - Response from server on port: ' + port);
});


// Options for https > certifikate and private key
// Creating the 'options'-object containing the path to the private key and certifikate
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}

// Tilføjer server til seaport - portene vil differentiere fra server til server.
// The HTTPS-module's createServer-method creates a new server-instance, that listens to specific ports and sends a response to the client.
// We place a call back function, which contains the app-object. 
const httpsServer = https.createServer(options, app);

//const httpServer = http.createServer(app);



//Implementing SSL > sslServer start listening
httpsServer.listen(ports.register('server'), function() {
    db.getConnection().then(
        console.log("---------- DATABSE CONNECTED ----------\nDatabase is connected")
    
    );
    console.log('---------- SERVER LISTENING  ----------');
    console.log('Server listening on port %d', this.address().port);
    console.log(this.address())
});


// httpServer start listening 
// Dette får vores server til at lytte igennem vores seaport instans efter eventuelle requests.
// ports.register registrerer en server i vores seaport-instans med navnet 'server' og returnerer porten der skal bruges for pågældende server.
// Heri laver vi en call-back funktion, der returnerer port og addressen som serveren lytter på.
/*
httpServer.listen(ports.register('server'), function() {
    db.getConnection().then(
        console.log("---------- DATABSE CONNECTED ----------\nDatabase is connected")
    );
    console.log('---------- SERVER LISTENING  ----------');
    console.log('Server listening on port %d', this.address().port);
    console.log(this.address())
});
*/




// Funktionen i createServer-metoden eksekveres, når nogen forsøger at tilgå computeren på den pågældende port.
// I dette tilfælde, når loadbalancer videresender en client-request til pågældende servers port.
// I browser: localhost:8080 ELLER curl http://localhost:8000
