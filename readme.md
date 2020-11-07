# Banking Application-aflevering

I denne aflevering er formålet, at leve op til følgende funktionelle krav (og obligatoriske):

1. Kunne få balancen på en given kundes account
2. Vi skal kunne få en liste af accounts.


## Kør programmet
1) Initialiser ved at køre følgende kommando i terminal:
```npm init```

2) Diriger til mappen *3_handin_template*:
```cd 3_handin_template```

3) Start appen ved følgende kommando
```node app.js```

4) Send GET requests, der rammer de 2 endpoints.


## Fil-struktur
I **app.js** har vi vores server-configuration. Der oprettes en "Network Socket", som blot er et stykke software, som står for at sende eller modtage data over internettet. I express teminologien er dette et andet udtryk for et endpoint. 
Så her oprettes vores server, og der oprettes forbindelse til mongoDB-databasen. Vi importerer routes fra 'routes' > 'accounts.js', som er alle vores endpoints.


I **'routes' > 'accounts.js'** har jeg oprettet de forskellige endpoints. Her indikeres selve http-metoden for requesten efterfulgt af endpointets URL. Jeg har valgt at oprette selve logikken for hver endpoint i separate controllers-filer, som derfor er importeret i accounts.js

I **'controllers'-mappen** har jeg oprettet mine controllers, som er selve requesthandlerne, dvs. de funktioner der eksekveres, når et specifikt endpoint rammes. 

   1) I filen 'getAccounts.js' er controlleren for, at kunne få en liste med alle accounts. Den har følgende endpoint:

   ```GET http://localhost:8080/accounts```

   2) I filen 'getAccount.js' er controlleren for, at kunne få balancen på en specifik kundes account ud. Den har følgende endpoint:

   ```GET http://localhost:8080/accounts/:id```



## Endpoints:

**1) Returnerer en liste med alle accounts**

   ```GET http://localhost:8080/accounts```

**2) Returnerer balancen for en specifik account ud fra accountID'et**

   ```GET http://localhost:8080/accounts/:id```

**3) Opretter en ny account**

   ```POST http://localhost:8080/accounts```

**4) Sletter en specifik account ud fra accountID'et**

   ```DELETE http://localhost:8080/accounts/:id```

**5) Opdaterer account-balancen for en specifik account vha. PUT-request**

   ```PUT http://localhost:8080/accounts/:id```

   **Opdaterer account-balancen for en specifik account vha. PATCH-request**
   
   ```PATCH http://localhost:8080/accounts/:id```


**6) Overfør penge fra én konto til en anden**
I parametren i URL'en angives ID'et på den konto, der skal overføres penge fra. I request-body sendes et objekt der indeholder 2 attributter. 1) 'to', som 
er ID'et på den konto, der skal overføres penge til. 2) 'amount', som er beløbet der skal overføres. 
   
   ```http://localhost:8080/accounts/transfer/:fromID```



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


## Assignment requirements
We ask you to develop a simple system to query account balances in a banking system. The system should consist of a client application and a server application. 
The system will only be used by a single teller.
Functional requirements
1) The system should allow teller to query the balance of a single account.
2) The system should allow teller to query the system for a list of accounts.

WE WANT YOU TO HANDIN A VIDEO AS WELL SHOWING THAT YOU HAVE SOLVED AT LEAST THE TWO FUNCTIONAL REQUIREMENTS. VOICEOVER IS OPTIONAL 😉. YOU CAN SEE AN EXAMPLE BELOW:
VERY LOW QUALITY. CHECK SLACK FOR BETTER QUALITY
 
If you have time, also develop following optional extras.
Nonfunctional Requirements:
1) Secure communications through TLS.
2) Add multiple clients.
3) Add multiple servers with shared data storage.
4) Add client authentication.
 
REMEMBER: Your code must be easy to run! You must either provide an internet address, a ready-to-run jar-file, a windows executable or a bat-file. In any case it must be clearly described. It is highly recommended that you try this out on an unsuspecting friend or colleague, who will test that there are no difficulties in accessing/executing your program.

Tips
1. Use the book!
2.  It’s fine to look stuff up online.
