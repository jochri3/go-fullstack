//MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//MODELS
const Product = require('./models/Product');

//CONNECT BDD
mongoose.connect('mongodb+srv://aarnow:DWyRCpQbDOL5jtcb@cluster0-dzhpq.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();//stocke notre application
app.use(cors());//empêche les erreurs cors
app.use(bodyParser.json());//rend les données du corp de la requête exploitable

//ROUTES:
app.post('/api/products', (req, res, next) =>{
  delete req.body._id;
  const product = new Product({
    ...req.body
  });
product.save()
  .then(()=> res.status(201).json({product}))
  .catch(error => res.status(400).json({error}));
});

app.put('/api/products/:id', (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(product => res.status(200).json({ message: "Produit modifié !" }))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/products/:id', (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(product => res.status(200).json({ message: "Produit supprimé !"}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/products/:id', (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({ product }))
    .catch(error => res.status(404).json({ error }));
})

app.get('/api/products', (req, res, next) => {
  Product.find()
    .then(products => res.status(200).json({ products }))
    .catch(error => res.status(400).json({ error }));
})

module.exports = app;