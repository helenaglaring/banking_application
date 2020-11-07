const express = require('express');
const router = express.Router();

// ---------- IMPORT CONTROLLERS ---------- //
const getAllClientsController = require('../controllers/getAllClients');        // GET all clients
const getClientController = require('../controllers/getClient');                // GET client
const createClientController = require('../controllers/createClient');          // POST new client
const updateClientController = require('../controllers/updateClient');          // UPDATE client information
const deleteClientController = require('../controllers/deleteClient');          // DELETE client
const getClientAccountsController = require('../controllers/getClientAccounts');// GET all client's accounts


// ---------- ENDPOINTS ---------- //

// Endpoint for getting all clients
router.get('/', getAllClientsController);

// Endpoint for creating a new clint
router.post('/', createClientController);

// Endpoint for getting one client
router.get('/:id', getClientController);

// Endpoint to update the information of an excisting client
router.put('/:id', updateClientController);

// Endpoint to delete an excisting client
router.delete('/:id', deleteClientController);


// Endpoint to get all accounts of a client - not mandatory
router.get('/:id/accounts', getClientAccountsController);



module.exports = router;