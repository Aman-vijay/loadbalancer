const net = require("net")
const port = process.argv[2] || 8000;
const express = require("express");


const server = net.createServer((socket)=>{
    console.log("Client is connected");

    socket.on("data",(data)=>{
        console.log(`Recieved : ${data.toString()}`)
     socket.write(`Echo: ${data.toString().trim()}\n`);

    })

    socket.on("end",()=>{
        console.log("Disconnected");
    })
    socket.on("error",(err)=>{
        console.log(`Something went wrong ${err}`)
    })
})

server.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})