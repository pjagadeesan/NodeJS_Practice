const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes);
console.log("Application has started..enjoy!")
server.listen(3000);