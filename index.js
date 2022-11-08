const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

//midleware 
app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("near-Health-Care server is runnig")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkgzac3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
   try{
    const serviceCollection = client.db("service-project").collection("Services");

     app.post("/service", async(req,res)=>{
      const service = req.body;
     const result = await serviceCollection.insertOne(service);
     res.send(result)
     })
     
   }
   finally {

   }
}


run().catch(error=>console.log(error))






app.listen(port,()=>{
    console.log("server-project is running on",port);
})