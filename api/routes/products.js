const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(':', '_').replace(':', '-') +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //akceptacja pliku
    cb(null, true);
  } else {
    //odrzucenie pliku
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//import modelu
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then((products) => {
      res.status(200).json({
        wiadomosc: 'Lista wszystkich produktów',
        info: products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        wiadomosc: 'Błąd',
        info: err,
      });
    });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  //wyciągam info z body o produkcie
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  //zapisuję dane do bazy
  product
    .save()
    .then((result) => {
      res.status(200).json({
        wiadomosc: 'Dodano nowy produkt',
        info: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        wiadomosc: 'Błąd',
        info: err,
      });
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((product) => {
      res.status(200).json({
        wiadomosc: 'Szczegóły produktu o nr ' + id,
        info: product,
      });
    })
    .catch((err) => {
      res.status(500).json({
        wiadomosc: 'Błąd',
        info: err,
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  Product.findByIdAndUpdate(id, product, { new: true })
    .exec()
    .then((newProduct) => {
      res.status(200).json({
        wiadomosc: 'Zmieniono dane produktu o nr ' + id,
        noweDane: newProduct,
      });
    })
    .catch((err) => {
      res.status(500).json({
        wiadomosc: 'Błąd',
        info: err,
      });
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove(id)
    .exec()
    .then((product) => {
      res.status(200).json({ wiadomosc: 'Usunięto produkt o nr ' + id });
    })
    .catch((err) => {
      res.status(500).json({
        wiadomosc: 'Błąd',
        info: err,
      });
    });
});

module.exports = router;
