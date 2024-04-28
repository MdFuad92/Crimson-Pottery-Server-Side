const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//9BCOyoE0OJjvctzG

//Crimson-Pottery

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vl4b2tk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const craftCollection = client.db('craftDB').collection('crafts')
    const userCollection = client.db('craftDB').collection('users')

   
    app.post('/crafts',async(req,res)=>{
      const craft = req.body
      const result = await craftCollection.insertOne(craft)
      res.send(result)
    })


    app.get('/crafts/:email',async(req,res)=>{
      console.log(req.params.email)
      const result = await craftCollection.find({email:req.params.email}).toArray()
      res.send(result)
      
    })
  
   
  
    app.get('/crafts/id/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result)
    }) 

  
   
    app.get('/crafts',async(req,res)=>{
        const cursor = craftCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
     
    app.put('/crafts/id/:id',async(req,res)=>{

      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updatedCrafts = req.body
      const crafts = {
        $set:{
         
          Customize : updatedCrafts.Customize,
          stock : updatedCrafts.stock,
          processing : updatedCrafts.processing,
          item_name : updatedCrafts.item_name,
          photo: updatedCrafts.photo,
          category: updatedCrafts.category,
          price : updatedCrafts.price,
          rating: updatedCrafts.rating,
          description : updatedCrafts.description
        }
      } 

      const result = await craftCollection.updateOne(filter,crafts,options)
      res.send(result)
    })
    
    app.delete('/crafts/id/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })



    //users database
    app.post('/users',async(req,res)=>{
        const user = req.body
        console.log(user)
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    app.get('/users',async(req,res)=>{
        const cursor = userCollection.find()
        const users = await cursor.toArray()
        res.send(users)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('my server is running');
})

app.listen(port,()=>{
    console.log(`my server is running: ${port}`)
})