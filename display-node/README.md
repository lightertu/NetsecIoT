# Display Node
This node is a web interface of NetsecIoT Testbed, it uses Node.js, Mongodb, and React.js. It sends requests to the Gateway node to gain knowledge of IoT devices in the testbed and generate User Interface based on the services IoT devices provide. 

## Install Node.js and Mongodb
Before you run Display Node make sure that you Mongodb is running at the background
without an issue.
 
## Download Node Dpendencies
* First you need to install `nodemon` at a monitor you can do that by issuing `npm install -g nodemon`
* Second you need to download all the Node.js dependenciesby issuing `npm install`
* Third you have to configure the ip address of the Gateway Node, you can do that by editing file 
  `display-node/server/routes/api.js`.
* Third you can run Display Node application by issuing `nodemon`
