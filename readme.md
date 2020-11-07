# DIS EKSAMEN 2020 - Banking application

Følgende program er et simpelt bank system udviklet til en bankkasserer. Systemet består af en server applikation, hvor man skal kunne hente alle konti samt et enkelt konto ud fra et id. Systemet skal dernæst udvides til at understøtte de følgende obligatoriske krav:


## Funktionelle og non-funktionelle krav

### Funktionelle krav
1. Systemet skal indeholde to modeller. **Clients** (kunder) og **Accounts** (konti). Disse skal indeholde følgende felter
* Client: id (*objectId*), firstname (*String*), lastname (*String*), street_address (*String*), city (*String*)
* Account: id (*objectId*), balance (*Number*), client_id (*String*), balance (*String*).

2. ystemet skal understøtte følgende CRUD (Create, Read, Update, Delete) funktioner på Client:
* Opret ny client (Create).
* Hent eksisterende client (Read clients' eksisterende oplysninger / detaljer). 
* Opdater en clients oplysninger (Update).
* Slet en client (Delete).


3. Systemet skal understøtte følgende CRUD funktioner på Account:
* Opret ny account (En client kan have flere accounts). 
* Læs accountens balance.
* Opdater accountens balance (hæv og indsæt).
* Overfør penge fra en account til en anden.
* Slet en account.


4. Ovenstående funktioner skal understøttes gennem følgende API-specifikation (DET ER VIGTIGT I BRUGER SAMME NAVNE TIL ENDPOINTS OG PARAMETRE):
- Hvis der står :id i endpointet betyder det, at id er et parameter, som skal bruges.name er navnet på parametret
- Body parameters er formateret som name: Type: req/opt.
- Name er navnet på parametret
- Type er typen. Fx String, Number, ObjectID
- req/opt siger om parametret er obligatorisk eller valgfrit



| Endpoint              | Metode | body parameters name: Type: req/opt                                                       | Beskrivelse                                                   |
|-----------------------|--------|-------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| /accounts             | GET    | -                                                                                         | Returnerer et array af alle konti                             |
| /accounts             | POST   | client_id: String: req balance: Number: opt                                               | Opretter en ny konto                                          |
| /accounts/:id         | GET    | -                                                                                         | Returnerer en specific konto                                  |
| /accounts/:id         | PUT    | balance: Number: opt                                                                      | Ændrer en konto. Det er kun balancen som kan ændres.          |
| /accounts/:id         | DELETE | -                                                                                         | Sletter en konto med det specifikke id                        |
| /accounts/:id/balance | GET    | -                                                                                         | Returnerer en specific kontos balance i formen {balance: 200} |
| /accounts/transfer    | PUT    | fromAccount:String:req toAccount: String: req amount: Number: req                         | Overfører penge fra en konto til en anden                     |
| /client               | GET    | -                                                                                         | Returnere et array af alle kunder                             |
| /client               | POST   | firstname: String: req lastname: String: req streetAddress: String: req city: String: req | Opretter en ny kunde                                          |
| /client/:id           | GET    | -                                                                                         | Returnerer en specific kunde                                  |
| /client/:id           | PUT    | firstname: String: opt lastname: String: opt streetAddress: String: opt city: String: opt | Opdaterer en kundes oplysninger                               |
| /client/:id           | DELETE | -                                                                                         | Sletter kunden med det specifikke id                          |



### Non-funktionelle krav

1. Netværksforbindelser skal være krypteret.
2. Systemet skal understøtte at der kan oprettes flere instanser af servere, som alle sammen bruger
den samme underlæggende datakilde (database / fil / hvad end i vælger, den skal bare være
persistent)
3. En load balancer skal distribuere trafikken mellem de forskellige servere.
4. Der skal laves en "one-click-run" løsning. Fx et script som starter hele systemet (loadbalancer,
forskellige applikationer osv).

## TEST
Der udleveres et test script skrevet i mocha, som du kan bruge til at teste jeres endpoints. Dette gøres ved at tilføje "test": "./node_modules/.bin/mocha --timeout 10000 --exit", til din package.json under scripts. Og så testes der gennem npm test . Hvis alt er lavet korrekt, skulle du gerne få 15 passing tests. Husk at dette er blot en hjælp til dig, for at finde ud af, hvor din kode er gået galt.


## Kør programmet
1) Initialiser ved at køre følgende kommando i terminal:
```npm install```

2) Kør programmet ved at køre følgende script i terminalen
```./run.sh```

3) Send requests, der rammer endpoints.


## Fil-struktur
I **app.js** har vi vores server-configuration. Der oprettes en "Network Socket", som blot er et stykke software, som står for at sende eller modtage data over internettet. I express teminologien er dette et andet udtryk for et endpoint. 
Så her oprettes vores server, og der oprettes forbindelse til mongoDB-databasen. Vi importerer routes fra 'routes' > 'accounts.js', som er alle vores endpoints.


I **'routes' > 'accounts.js'** har jeg oprettet de forskellige endpoints. Her indikeres selve http-metoden for requesten efterfulgt af endpointets URL. Jeg har valgt at oprette selve logikken for hver endpoint i separate controllers-filer, som derfor er importeret i accounts.js

I **'controllers'-mappen** har jeg oprettet mine controllers, som er selve requesthandlerne, dvs. de funktioner der eksekveres, når et specifikt endpoint rammes. 


## Endpoints:

### Accounts
**1) Returnerer et array af alle konti**

   ```GET https://localhost:3443/accounts```

**2) Opretter en ny konto**

   ```POST https://localhost:3443/accounts```

**3) Returnerer en specific konto**

   ```GET https://localhost:3443/accounts/:id```


**4) Ændrer en konto. Det er kun balancen som kan ændres**

   ```PUT https://localhost:3443/accounts/:id```

**5) Sletter en konto med det specifikke id**

   ```DELETE https://localhost:3443/accounts/:id```   


**6) Returnerer en specific kontos balance i formen `{balance: 200}`**

   ```GET https://localhost:3443/accounts/:id/balance```  


**7) Overfør penge fra én konto til en anden**
 request-body sendes et objekt der indeholder 3 attributter. 1) ID'et på den konto, der skal overføres penge fra. 2) 'to', som 
er ID'et på den konto, der skal overføres penge til. 3) 'amount', som er beløbet der skal overføres. 
   
   ```PUT https://localhost:3443/accounts/transfer```  

### Client

**8) Returnerer et array af alle kunder**

   ```GET https://localhost:3443/client``` 

**9) Opretter en ny kunde**

   ```POST https://localhost:3443/client``` 

**10) Returnerer en specific kunde**

   ```GET https://localhost:3443/client/:id``` 

**11) Opdaterer en kundes oplysninger**

   ```PUT https://localhost:3443/client/:id``` 

**12) Sletter kunden med det specifikke id**

   ```DELETE https://localhost:3443/client/:id``` 

**13) Returnerer et array med alle konti på en given kunde**

   ```GET https://localhost:3443/client/:id/accounts``` 


##  Generelt om opgaven
For at kunne løse ovenstående opgave, har vi brug for to ting:

1. En server, som kan håndtere forskellige endpoints. 
   * Et endpoint er et sted på serveren, som trigger en bestemt respons, og er typisk formatteret som addresse:port/api/endpoint/metode fx localhost:8000/api/accounts/. I dette tilfælde er der ikke en decideret metode, fordi vi "bare" ønsker at manipulere accounts. Det betyder, at vi sender vi HTTP-requests som sendes over TCP-protokollen, og som rammer et givent endpoint, som trigger en handling. En HTTP-request kan have forskellige metoder:
     `GET` er et standard kald, som bruges til at efterspørge specifikke ressourcer eller information herom. Den bruges typisk med ex `curl` eller når der indtastes en adresse i browseren. Denne rammer et endpoint med en forventing om at få noget data retur.

     `POST` bruges til at oprette nye ressourcer, når vi eksempelvis ønsker at tilføje noget til vores database. Dette ved at sende data med i en request, her gennem request-body. Vi bruger POST-requestet til at oprette et nyt account-document i vores account-collection. 

     `PUT` bruges på samme måde som `POST` men i stedet for at tilføje data, er `PUT` ment til at ændre allerede eksisterende data. Så hvor POST rammer en hel collection, går PUT ind og rammer en specifik ressource. 

     `PATCH` kan bruges til at udføre en partiel opdatering af en ressource (For det meste bruges PUT, men PATCH kan bruges). Så hvor PUT vil bruges til at erstatte en hel ressource, kan PATCH bruges til at ændre eksempelvis en enkelt ressource-property.
   

     `DELETE` bruges til at slette  data i databasen. Her bruger vi DELETE til at slette en specific ressource fra vores account-collection baseret på account-ID'et.


     Hvis dette skal relateres til endpoints, så betyder det, at når vi sender et HTTP request med metoden `GET`til eksempelvis `localhost:8000/accounts`, så forventer vi at få en liste af accounts tilbage. Hvis vi sender en `POST`til samme addresse, forventer vi, at der sendes noget data med, som der kan oprettes en ny account ud fra. 

2. En database som indeholder vores persistente data.

   * En database kan siges at være en instans som indeholder data. Her bruges en mongodb database. Ifølge de funktionelle krav til denne opgave skal vi 'blot' kunne returnere balancen for et account og en liste af accounts. Dette kan i princippet løses uden en database, simpelthen ved fx at hardcode dataen (eller gemme den i en JSON-fil) og så returnere denne. Jeg bruger dog en database, og bruger MongoDB-compass som UI.

Denne struktur betyder, at endpoints'ne er den del af serveren som er tilgængelige for omverdenen. Det er disse som omverdenen bruger til at kommunikere med serveren og manipulere dataen. Udover dette er serveren for det meste forbundet til noget data storage som fx en database. Forholdet kan illustreres således:

![](https://i.imgur.com/aVhW3sA.jpeg)

1. Der sendes en HTTP-request til endpointet. Fx `curl localhost:8080/accounts`. Ved denne komando sendes der en `GET` request. Serveren modtager `GET` requesten på `/accounts` og kalder den dertilhørende kode.
2. Denne kode querier databasen og beder om alle accounts, der ligger i denne.
3. Databasen returnere en liste med accounts til serveren
4. Disse sendes retur til klienten (fx jeres terminal, hvis der bruges curl) i et format som er tilladt over TCP. Fx en JSON-string.

Nederst ser i et eksempel på en HTTP-post request. Her er metoden sat til `POST`, og der er tilføjet et ekstra felt kaldet `body`. Body indeholder den data, der sendes af sted til serveren. Så når serveren modtager dette på samme endpoint `localhost:8080/accounts`, køres der en anden metode, fordi det er en `POST`request, og det registrerer serveren. Serveren beder derfor databasen om at oprette en ny account. Databasen svarer serveren tilbage med en success eller en failure, og serveren returnerer denne til klienten. 
