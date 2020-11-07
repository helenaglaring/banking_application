# HOW TO RUN:
# Hvis i ikke kan køre denne fil, så kan det være fordi i ikke har run/execute access.
# På mac kan dette gøres ved at køre `sudo chmod 777 <fil_navn>`, og så kan i køre filen med ./<fil_navn> i terminalen. 


# seaport
echo "\nRunning Seaport"
npm run seaport listen 9090 &
sleep 2 # We want to wait until seaport has successfully started 

# servers
echo "\nRunning servers"
node app.js &
#server1=$! # this is to save variables, if we want to shut down process manually. 'pkill node' is more efficient.
node app.js &
#server2=$!
sleep 2 # wait until servers are initialized


# loadbalancer
echo "\nRunning loadBalancerSSL"
node loadBalancerSSL.js &
loadBalancer=$!
sleep 2 # wait until loadbalancer is initialized


# curl request
# echo "\nSending curl requests"
# for i in {1..10}
# do
# curl localhost:8080/clients
# echo ""
# # echo "\n"j
# sleep 1
# done

read -p "press any key to shutdown"
echo "\n Shutting down"
pkill node
kill -9 $(lsof -t -i:3443)
kill -9 $(lsof -t -i:9090)
