const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config()

//midleware 
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("near-Health-Care server is runnig")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkgzac3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
        app.get("/myreviews", async (req, res) => {
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
            const query = {_id:ObjectId(id)}
            const result = await reviewCollection.deleteOne(query);
            console.log(result)
            res.send(result)
        })



    }
    finally {

    }
}


run().catch(error => console.log(error))






app.listen(port, () => {
    console.log("server-project is running on", port);
})