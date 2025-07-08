const net = require("net");
const PORT = 9000;

const backends = [
  { host: "127.0.0.1", port: 8000, healthy: true, connections: 0 },
  { host: "127.0.0.1", port: 8001, healthy: true, connections: 0 },
  { host: "127.0.0.1", port: 8002, healthy: true, connections: 0 },
];

let current = 0;
//Round robin
// function getNextBackend() {
//   const total = backends.length;
//   for (let i = 0; i < total; i++) {
//     const backend = backends[current];
//     current = (current + 1) % total;
//     if (backend.healthy) return backend;
//   }
//   return null;
// }


//Least Connection
function getNextBackend(){

    const healthyBackends = backends.filter((backend)=>backend.healthy);
    if(healthyBackends.length ===0){
        return null;
    }

    const selected = healthyBackends.reduce((minBackend,currBackend)=>{
        return( currBackend.connections<minBackend.connections )? currBackend:minBackend;
    })
    return selected;



}
function decrementCounter(backend) {
  if (backend.connections > 0) backend.connections--;
}

function checkBackendHealth(backend) {
  const socket = net.connect(backend.port, backend.host);
  socket.setTimeout(1000);

  socket.on("connect", () => {
    backend.healthy = true;
    socket.destroy();
  });

  socket.on("error", () => {
    backend.healthy = false;
  });

  socket.on("timeout", () => {
    backend.healthy = false;
    socket.destroy();
  });
}

setInterval(() => {
  backends.forEach(checkBackendHealth);
}, 5000);

// Optional live stats
setInterval(() => {
  console.log("\n🧪 Backend status:");
  backends.forEach((b) => {
    console.log(`${b.host}:${b.port} | healthy: ${b.healthy} | active: ${b.connections}`);
  });
}, 10000);

const server = net.createServer((clientSocket) => {
  console.log("Client connected to load balancer");

  const backend = getNextBackend();
  if (!backend) {
    console.log("❌ No healthy backend available");
    clientSocket.end("503 Service Unavailable\n");
    return;
  }

  backend.connections++;

  const backendSocket = net.connect(backend.port, backend.host, () => {
    console.log(`Connected to backend ${backend.host}:${backend.port}`);
  });

  // Pipe data both ways
  clientSocket.pipe(backendSocket);
  backendSocket.pipe(clientSocket);

  let connectionClosed = false;
  function closeConnection(reason) {
    if (connectionClosed) return;
    connectionClosed = true;

    clientSocket.destroy();
    backendSocket.destroy();
    decrementCounter(backend);

    console.log(`Connection closed: ${reason}`);
  }

  // Handle disconnects/errors
  clientSocket.on("end", () => closeConnection("client ended"));
  clientSocket.on("error", () => closeConnection("client error"));
  clientSocket.setTimeout(10000, () => {
    console.log("Client socket timed out");
    closeConnection("client timeout");
  });

  backendSocket.on("error", () => closeConnection("backend error"));
  backendSocket.setTimeout(10000, () => {
    console.log("Backend socket timed out");
    closeConnection("backend timeout");
  });
});

server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
