const express = require('express');

// Using the express.Router()-method to create a new router object which is an isolated instance of routes.
// It is a kind of routing system - like a 'mini-app' capable of performing routing functions and middleware. 
// We create a router as a module, and afterwards we add different HTTP method routes to it.
const router = express.Router();


/*
Express routing determines how our application responds the client request to a specific endpoint (aka URI or path) 
and a certain HTTP request method (GET, POST, PUT, DELETE etc.).

Every route can have one or more handler functions, that execute when the corresponding route is matched. 

On the router-instance the HTTP request method is specified, the path on the server and a handler
which is the function that is executed when the route is matched. 

*/

// ---------- IMPORT CONTROLLERS ---------- //
const accountController = require('../controllers/accountController')

// ----------  ENDPOINTS ---------- //
// Endpoint for getting all accounts
router.get('/', accountController.getAccounts);                     // GET all accounts

// Endpoint for creating a new account
router.post('/', accountController.createAccount);                  // CREATE new account           

// Endpoint make a transaction
router.put('/transfer', accountController.transfer);                // UPDATE 2 account balances

// Endpoint for getting a specific account by id
router.get('/:id', accountController.getAccount);                   // GET account


// Endpoint to update the balance of an excisting account
router.put('/:id', accountController.updateAccountBalance);         // UPDATE account balance

// Endpoint to delete an excisting account
router.delete('/:id', accountController.deleteAccount);             // DELETE account


// Endpoint for getting a specific account balance by id
router.get('/:id/balance', accountController.getAccountBalance);    // GET account balance


// The router-object is exported so we can import the routes and corresponding requesthandlers in the main app.
// Since a router behaves like middleware, we can pass it as an argument to app.use() which is done in app.js
module.exports = router;


// Src: https://expressjs.com/en/starter/basic-routing.html