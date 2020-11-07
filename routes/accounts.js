const express = require('express');
const router = express.Router();

// ---------- IMPORT CONTROLLERS ---------- //
const getAllAccountsController = require('../controllers/getAllAccounts');      // GET all accounts
const getAccountController = require('../controllers/getAccount');              // GET account
const getAccountBalanceController = require('../controllers/getAccountBalance');// GET account
const createAccountController = require('../controllers/createAccount');        // CREATE new account
const updateBalanceController = require('../controllers/updateAccountBalance'); // UPDATE account balance
const deleteAccountController = require('../controllers/deleteAccount');        // DELETE account
const transferController = require('../controllers/transfer');                  // UPDATE 2 account balances

// ---------- OBLIGATORISKE ENDPOINTS ---------- //
// Endpoint for getting all accounts
router.get('/', getAllAccountsController);

// Endpoint for creating a new account
router.post('/', createAccountController);

// Endpoint make a transaction
router.put('/transfer', transferController);

// Endpoint for getting a specific account by id
router.get('/:id', getAccountController);


// Endpoint to update the balance of an excisting account using PUT
router.put('/:id', updateBalanceController);

// Endpoint to delete an excisting account
router.delete('/:id', deleteAccountController);


// Endpoint for getting a specific account balance by id
router.get('/:id/balance', getAccountBalanceController);





module.exports = router;