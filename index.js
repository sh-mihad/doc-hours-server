const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//midleware 
app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("near-Health-Care server is runnig")
})

app.get("/test",(req,res)=>{
    const user ={
      a :  process.env.DB_USER,
      b : process.env.DB_PASSWORD
    }
    res.send(user)
})


app.listen(port,()=>{
    console.log("server is running on",port);
})