const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());


//Mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z5uza0f.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      
      const database = client.db('prStore');
      //Collection
      const itemsCollection = database.collection('allItems');
      const inHistoryCollection = database.collection('inHistory');



    //Insert items in store
      app.post('/addItem', async (req, res) => {
          const data = req.body;
          const result = await itemsCollection.insertOne(data);
          res.send(result);
      })
    // Get all items
      app.get('/allItems', async (req, res) => {
          const result = await itemsCollection.find().toArray();
          res.send(result);
      })
    
    // History info
    app.post('/history', async (req, res) => {
      const data = req.body;
      const result = await inHistoryCollection.insertOne(data);
      res.send(result);
    })
    //Get all store in history data
    app.get('/inHistory', async (req, res) => {
      const result = await inHistoryCollection.find().toArray();
      res.send(result);
    })
    // Update inStore product quantity;
    app.put('/storeIn/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const newQuantity = data.newQnt;
      const filter = { _id: new ObjectId(id) }
      const query = {
        $set:{quantity:newQuantity}
      }
      const result = await itemsCollection.updateOne(filter, query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('pr-store server is running');
})
app.listen(port, () => {
    console.log('pr-server is running on the port', port);
})