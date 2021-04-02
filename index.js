const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stbya.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error=", err);
  const productCollection = client.db("freshFood").collection("products");
  const ordersCollection = client.db("orders").collection("products");
  
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err,items) => {
      res.send(items);
    })
  })

  app.get('/products/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    productCollection.find(id)
    .toArray((err,items) => {
      res.send(items);
    })
  })

  app.post("/addProduct",(req, res) => {
      const newProduct = req.body;
      productCollection.insertOne(newProduct)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

app.post('/addOrders', (req, res)=>{
    const newOrders =req.body;
    ordersCollection.insertOne(newOrders)
    .then(result =>{
        res.send(result.insertedCount > 0 );
        console.log(result);
    })
    console.log(newOrders);
})

  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
      .toArray((err,documents) => {
          res.send(documents)
      })
  })

  app.delete('/deleteProduct/:id',(req, res) => {
    const id = ObjectId(req.params.id);
    productCollection.deleteOne({_id: id})
    .then(documents => {
      console.log(documents);
      res.send(documents.deletedCount > 0);
    })
  })
  console.log("database connected successfully");
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})