
/*
Her implementeres en simpel load balancer, baseret på Round Robin-metoden, der ligeligt uddeler requests til serverne.
Load balanceren skal fordele request fra klienten ligeligt mellem serverne.

I dette simple ekesempel sender en klient requests til load balanceren (load-balancer.js).
Denne request bliver så videresendt til forskellige servere (server.js) ved Round Robin scheduling.

Ulempe ved RR-algoritmen er at den antager at serverne er ens nok til at håndtere ligelige fordelt belastning.
Hvis nogle servere har mere CPU, RAM e.l. har aloritmen ingen måde at distributere flere requests til disse servere.
Som følge vil servere med mindre kapacitet blive overbelastet og fejle hurtigere mens kapacitet på andre servere er tomme.

Det bliver der i højere grad taget højde for ved Weighted Round Robin (weighted-load-balancer.js)
*/

// Importerer http-modulet
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');

// Importerer http-proxy-modulet, som er et HTTP-proxy bibliotek.
const httpProxy = require('http-proxy');

// Importerer 'seaport'-modulet, der er en service register og kan bruges til at dele requests ud til en given port.
const seaport = require('seaport');

// Opretter en seaport instans knyttet til en TCP-connection. Opretter varriablen 'ports' der holder seaport-objektet.
// Det er fra denne seaport instans, hvor vi kan tilgå de registrerede servere.
let ports = seaport.connect('localhost', 9090);

// Reference til step 4
let i = - 1;

// Laver  en proxy ved hjælp af httpProxy.createProxyServer().
// Dette gør det muligt at videresende request til et mål vi selv definerer.
const proxy = httpProxy.createProxyServer({});


// Med HTTPS
// Laver vores loadbalancer server om til en ssl-server. 
// Herfra sendes det samme certifikat og key med som properties. 


// Options for https > certifikate and private key
// Creating the 'options'-object containing the path to the private key and certifikate
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}

// HTTPS-modulet bruges til at oprette en HTTPS-server instans der lytter på port 3443.
// Load balancere videresender dernest den modtagede klientrequest til én af de registrerede servere baseret på den algoritme vi definerer i cb-funktionen.
let httpsServer = https.createServer(options, function (req, res) {
    // Bruger ports.query() som returnerer et array med alle registrerede servere i vores seaport-instans
    let addresses = ports.query('server');
    console.log('------------- ADDRESSES ------------');
    console.log(addresses);

    if (!addresses.length) {
        console.log('------------- NO SERVER AVAILABLE ------------');
        // Hvis dette array er tomt sendes et respons tilbage til klienten om, at ingen server er tilgængelig.
        res.end("No server available")
    } else {
        // Her sørges for at vores proxy itererer igennem vores array hver gang den får en request.
        // Heri bruges i som tælle-variabel, og hver gang instansen bliver initieret, sættes i til restværdien af i + 1 og
        // længden af array'en. Til sidst bruges vores proxy-instans til at kalde proxy.web og sender vores request videre til
        // vores mål. Dette implementeres i http-socket'ens callback-function.
        i = (i + 1) % addresses.length;
        // Bruger string-metoden split() til at opdele objektets 'host'-addresse hvor der er semikolon. Dette returnerer et array alle splittede
        // elementer. Da vi ved at IP-addressen er det sidste element bruges array-metoden .reverse til at invertere rækkefølgen og nu vil IP-addressen
        // være det første element med indeks 0.
        let host = addresses[i].host.split(":").reverse()[0];

        // Gemmer serverens tilsvarende port i en variabel.
        let port = addresses[i].port;

        // Vi bruger nu de definerede 'host' og 'port' variabler til at definere, hvor requesten skal sendes til
        // target skal laves om til “https” i stedet for “http”, 
        // Tilføjer en ekstra parameter efter “target” som er “secure: false”, da det er et self-signed certifikat.
        proxy.web(req, res, { target: 'https://' + host + ':' + port, secure: false }, () => {
        });
        console.log('------------- FORWARDING REQUEST TO SERVER ------------');
        console.log(`Forwarding request to server on port ${port}`)
    }
});

// Load balanceren sættes til at lytte på en port (3443 for https)
httpsServer.listen(3443, function() {
    console.log('---------- LOAD BALANCER LISTENING  ----------');
    console.log('Load-balancer listening on port %d', 3443)
});


/*
For at starte load balanceren skrives følgende:

npm run seaport listen 9090 (da vi bruger port 9090)
node load-balancer.js (I en anden terminal)
node server.js (I lige så mange terminaler som vi har lyst. Hver gang dette skrives, initieres en ny server).

Hvis alt er gået som planlagt, bør vi kunne skrive curl http://localhost:3443 i terminalen,
for at sende en request til load balanceren.

Hver anden request vil blive sendt til en anden port.

*/
