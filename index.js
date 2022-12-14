const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config()
var jwt = require('jsonwebtoken');

//midleware 
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("near-Health-Care server is runnig")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkgzac3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function jwtVerify (req,res,next){
    const authorized = req.headers.authorizaton;
    if(!authorized){
        return res.status(401).send({messege:"Unauthorized access"})
    }
    const token = authorized.split(" ")[1]
    jwt.verify(token,process.env.SERVICE_TOKEN,function(err,decoded){
        if(err){
            return res.status(401).send({messege:"Unauthorized access"}) 
        }
        req.decoded = decoded;
        next()
    })

}


async function run() {
    try {
        const serviceCollection = client.db("service-project").collection("Services");
        const reviewCollection = client.db("service-project").collection("Reviews")

        // Service post
        app.post("/service", async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        // getting service for home page
        app.get("/3service", async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get all service 
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // get single service for deatils page
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })

        //insert a review
        app.post("/review", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        // get all reviews
        app.get("/review", async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get reviws using email address
        app.get("/myreviews",jwtVerify, async (req, res) => {
            const decoded = req.decoded;
            if(decoded.email !==req.query.email){
                return res.status(403).send({message:"forbiden"})
            }
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const curson = reviewCollection.find(query);
            const result = await curson.toArray();
            res.send(result)
        })

        //-Delete a review
        app.delete("/review/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            console.log(result)
            res.send(result)
        })

        // get single review for edit 
        app.get("/reaviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })
    
        // update review
        app.put("/update/:id", async(req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                comment : body.review
                }
            }
            const result = await reviewCollection.updateOne(filter,updateDoc,option);
            res.send(result)

        })
        // console.log(process.env.SERVICE_TOKEN)

        //api for JWS token
        app.post("/jwt",(req,res)=>{
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user,process.env.SERVICE_TOKEN,{expiresIn:"1h"})
            res.send({token})
        })
        

    }
    finally {

    }
}


run().catch(error => console.log(error))






app.listen(port, () => {
    console.log("server-project is running on", port);
})