# ----------------------------------------------------------------------------------------------------------------------------------------
# HOW TO RUN:
# If the file can't be executed it might be because we don't run/execute access.
# Solved by running `sudo chmod 777 <file_name>`, and then the file can be executed running ./<file_name> in the terminal. 
# ----------------------------------------------------------------------------------------------------------------------------------------


# This script is used to turn a express-server into an HTTPS-server by implementing SSL in our application. 
# To implement SSL in our app we need two properties; "key" og "cert", which is our private key and (self-signed) certificate. 
# In this script we generate these two; the self-signed CA certificate and private key.

# First step is to download 'OpenSSL' on our computer. Done by using homebrew running "brew install openssl". 

# ----------- Private key ----------
# Before our server can communicate via SSL we need a certificate - in this case
# we use a self-signed certificate, since we don't use a certificate issued by a trusted CA. 


# Create a directiry in which we keep our private key and certificate. The folder is created as 'cert' in our root-folder which is the same
# as our app.js file is placed.
echo "Create cert-directory"
mkdir cert
# Navigating into the newly created 'cert'-folder
cd cert

# -- Generate private key--
# "genrsa" means we generate a private key based on the RSA algorithm
# "-out key.pem" is the name of the output
echo "Generate private key"
openssl genrsa -out key.pem 
# Generates a key.pem file in the 'cert'-directory


# ----------- Certificate signing request ----------
# We initate a certificate signing request meaning we need an authority to verify ourselves with a digital identity. 
# Normally a third-party authority is used to verify this request, but we use ourself as authority. 
# Under professional circumstances it gives no effect to be verified by ourselves.
# We instruct the express server to identify itself by using the issued certificate and 'force' the clients to connect over TLS.

# -- Certificate signing request --
# We request a new certificate based on our private key in the key.pem-file
echo "Certificate signing request"
openssl req -new -key key.pem -out csr.pem -subj "/C=DK/O=CBS"
# Generates a csr.pem file in the 'cert'-directory
# If everything goes right we will be asked different information which identifies our digital identiry
# We only fill "DK" in Country Code and "CBS" i Organization. The rest is  


# ----------- Certificate ----------
# Generate self signed CA cert
#	"x509" is the format of the certificat
#	"-days" is how many days it is valid
#	"-in" is what request it is basd on
#	"-signkey" is the privatekey on which is it based 
echo "Creating the certificate"
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
# This creates a cert.pem file

