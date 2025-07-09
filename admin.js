const express = require("express");
const { backends } = require("./proxy");
const app = express();
const ADMIN_PORT = 9001;

app.get("/",(req,res)=>{
    res.send("<h2> Load Balancer Admin Panel</h2><p>Try /stats or /health</h2>")
})

app.get("/stats",(req,res)=>{
    res.json(
        backends)

})

app.get("/health",(req,res)=>{
    const anyHealthy = backends.some(b=>b.healthy);
    res.status(anyHealthy ? 200:503).send(anyHealthy?"OK":"Unhealthy")});

app.listen(ADMIN_PORT,()=>{
      console.log(` Admin API running at http://localhost:${ADMIN_PORT}`);
})    