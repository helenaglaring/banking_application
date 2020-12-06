const express = require('express');
const router = express.Router();

// ---------- IMPORT CONTROLLERS ---------- //
const clientController = require('../controllers/clientController')


// ---------- ENDPOINTS ---------- //
// Endpoint for getting all clients
router.get('/', clientController.getClients);                       // GET all clients

// Endpoint for creating a new clint
router.post('/', clientController.createClient);                    // POST new client

// Endpoint for getting one client
router.get('/:id', clientController.getClient);                      // GET client

// Endpoint to update the information of an excisting client
router.put('/:id', clientController.updateClient);                  // UPDATE client information

// Endpoint to delete an excisting client
router.delete('/:id', clientController.deleteClient);               // DELETE client


// Endpoint to get all accounts of a client - not mandatory
router.get('/:id/accounts', clientController.getClientAccounts);    // GET all client's accounts


module.exports = router;