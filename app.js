const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//połączenie z bazą
mongoose.connect(
  'mongodb+srv://shop:' +
    process.env.ATLAS_PASS +
    '@mbo.ns57q.mongodb.net/shop?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const productRoutes = require('./api/routes/products');

//static
app.use('/uploads', express.static('uploads'));

app.use(morgan('combined'));
app.use(bodyParser.json());

//routy
app.use('/products', productRoutes);

//obsługa błędnych routów
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      wiadomosc: error.message,
    },
  });
});

module.exports = app;
