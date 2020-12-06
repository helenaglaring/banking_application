/*--loadBalancerSSL.js-------------------------- Load balancer -----------------------------------------------------*/

/*
Here a simple load balancer is implemented based on the Round Robin-method, that forwards requests to 
the servers, that are registered in seaport. The load balancer is set up to equally distribute client requests 
between the servers.

In this implementation a client sends a request to the load balancer (loadBalancerSSL.js)
The requests is forwarded to one of the express-servers (app.js) based on Round Robin Scheduling. 

The drawback of th RR-algorithm is, that it assumes that the servers are similar enough to handle equally distributed load.
If some servers have more CPU, RAM etc. the algorithm can't distribute more requests to these servers. 
As consequence the servers with less capacity will be overloaded and fail while the capacity on other servers are *empty?
*/

// Importing the modules to use for HTTPS (SSL/TLS-connection)
const https = require('https');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Importing the http-proxy-module, which is an HTTP-proxy library supporting websockets.
// It is used to implement our load balancer
const httpProxy = require('http-proxy');

// Importing the 'seaport'-modulet, that is a service used to distribute requests to given ports.
const seaport = require('seaport');

// Creating a seaport instance connectd to a TCP-connection. Declaring the varriable 'ports' that holds the seaport-object.
// From this seaport instance instans, we can reach the registred servers. 
let ports = seaport.connect('localhost', 9090);

// Declaring a variable i that is used in our RR-algorithm further down
let i = - 1;

// Creating an options-object containing the self-signed certificate and private key we need for establishing the SSL connection over HTTPS
// Creating the 'options'-object containing the path to the private key and certifikate
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}

// Activating the validation of a secure SSL certificate to the target connection
// Creating a new proxy using httpsProxy.createProxyServer().
// This makes it possible to forward requests to a target we define.
const proxy = httpProxy.createServer({
    ssl: httpsOptions,
    target: config.baseUrl,//"https://localhost:3443",
    secure: false // Because it is a self-signed certificate
}).listen(443)


// Using the HTTPS-module to create an HTTPS-server instance
// We pass in the httpsOptions since the load balancer also needs to be a ssl-server. From this the same certificate and private key must be sent as properties. 
// The load balancer forwards the incoming client requests to one of the registred servers
// The distribution is based on the algorithm we define in the callback-function;
let httpsServer = https.createServer(httpsOptions, function (req, res) {
    // Using ports.query() that returns an array with all registered servers in the seaport-instance
    let addresses = ports.query('server');
    console.log('\n------------- ADDRESSES ------------');
    console.log(addresses);

    if (!addresses.length) {
        console.log('------------- NO SERVER AVAILABLE ------------');
        // If the array is empty we send a responce to the client that no server is available 
        res.end("No server available")
    } else {
        // Here we make sure that the proxy iterates through the array of servers each time it receives an incoming request.
        // We use the global declared variable i as counter; each time the instance is initated 'i' is assigned to the residual value (restværdi) of i + 1
        // and the length of the array. This makes sure that the load balancer alternates between the different servers.
        // At last we use the proxy instance to call proxy.web and forward the request to the target. 
        // This is implemented in the HTTPS-socket's callback function
    
        i = (i + 1) % addresses.length;

        // Using the string-method .split() to divide the object's 'host'-address at the place where there is a semicolon ';'
        // This returns an array of all the splitted elements. 
        // Since we know, that the IP-address is the last element we use the array-mthod .reverse() to invert the order.
        // The IP address will be the first element with index '0'
        let host = addresses[i].host.split(":").reverse()[0];

        // Assigning the server's corresponding port to a variable.
        let port = addresses[i].port;

        // We use the defined 'host' and 'port' variables to define to where the request must be forwarded.
        // We add an extra parameter after the 'target'-option which is “secure: false”, since we use a self-signed certificate 
        // and not a certificate signed by a trusted CA.
        proxy.web(req, res, { target: 'https://' + host + ':' + port, secure: false }, () => {
        });
        console.log('\n------------- FORWARDING REQUEST TO SERVER ------------');
        console.log(`Forwarding request to server on port ${port}`)
    }
});

// The load balancer listens to port 3443 for HTTPS.
// The load balancer exchanges equally between the registered server instances.
httpsServer.listen(3443, function() {
    console.log('---------- LOAD BALANCER ----------');
    console.log('Load balancer listening on port %d', 3443)
});


// Don't run port lower than 1024
// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
