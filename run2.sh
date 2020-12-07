sudo chmod 777 run.sh
# HOW TO RUN:
# Hvis ikke denne fil kan eksekveres, kan det skyldes manglende run/execute access.
# På mac kan dette gøres ved at køre `sudo chmod 777 <fil_navn>`, hvorefter filen kan køres med ./<fil_navn> i terminalen. 
# sudo chmod 777 run.sh


# seaport
echo "\nRunning Seaport"
npm run seaport listen 9090 &
sleep 2 # wait until seaport has successfully started 

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

read -p "press any key to shutdown"
echo "\n Shutting down"
pkill node
kill -9 $(lsof -t -i:3443)
kill -9 $(lsof -t -i:9090)


# src: https://cbscanvas.instructure.com/courses/11500/files/419119?module_item_id=328931
