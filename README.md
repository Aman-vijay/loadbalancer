# ⚡ Node.js Layer 4 Load Balancer

A lightweight TCP (Layer 4) load balancer built using Node.js and raw sockets — no external dependencies, no frameworks.

## ✨ Features

- 🔁 Load balancing (Least Connections)
- 🩺 Active health checks every 5 seconds
- 🔌 TCP socket forwarding via `net` module
- 🔄 Graceful client disconnects
- 🕒 Idle connection timeouts
- 📊 Live backend status logging
- 🧪 Tested via Telnet/Netcat


---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/aman-vijay/loadbalancer.git
cd loadbalancer
```
###2. Install dependencies
No dependencies required — it's just Node.js!

```bash
npm install
```

###3. Start the backend echo servers
```bash
node echo-server.js 8000
node echo-server.js 8001
node echo-server.js 8002
```

###4. Start the load balancer
```bash
npm start
```

###5. Test with Telnet
```bash
telnet 127.0.0.1 9000
```
