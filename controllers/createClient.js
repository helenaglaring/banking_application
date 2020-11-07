const clientModel = require("../models/client");


// Endpoint for adding a new client
module.exports = async(req, res) => {
    try {
        //console.log(req.body);

        const { firstname, lastname, streetAddress, city } = req.body;   // extracting client info
        console.log(req.body);
        let newClient= await clientModel.create({
            firstname: firstname,
            lastname: lastname,
            street_address: streetAddress,
            city: city
        });


        console.log('---------- CREATE CLIENT ---------- ');
        let message = "New client created: ";
        console.log(message);
        console.log(newClient);

        res.send(newClient)

    } catch (err) {
        console.log({ message: err })
    }
};