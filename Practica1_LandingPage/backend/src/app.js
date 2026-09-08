import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const port = process.env.PORT 

const server = express();
server.use(express.static(path.resolve("../frontend/")))

server.get('/', (req, res) =>{
    res.sendFile(path.resolve("../frontend/index.html"))
})

server.listen(port, ()=>{
    console.log(`server running on ${port}`);
})
