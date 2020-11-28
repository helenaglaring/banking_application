const express = require('express');
// Using the express.Router class to create modular, mountable route handlers.
// The Router is a kind of routing system - like a 'mini-app'.
// A router is created as a module. 
// We define different routes and mounts the router module on a path in the main app (app.js)

const router = express.Router();

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



module.exports = router;