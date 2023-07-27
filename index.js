const express = require("express");
const app = express();

const Joi = require("joi");

const { v4: uuidv4 } = require("uuid");

const products = [
  {
    id: "1",
    name: "Orange",
    price: 20,
  },
  {
    id: "2",
    name: "Apple",
    price: 30,
  },
];

app.get("/", (req, res) => {
  return res.send("Hi Rahat");
});

// show list of products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// show list of products
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === id);

  if (!product) {
    return res.status(404).json({
      error: "No Product Found In This ID",
    });
  }
  res.send(product);
});

// insert a product data
app.use(express.json());
app.post("/api/products", (req, res) => {
  const { error } = validation(req.body);
  if (error) {
    return res.status(404).json({
      message: error.details[0].message,
    });
  }

  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: req.body.price,
  };

  products.push(product);
  return res.json(product);
});

// update specific product data (using PUT method)
app.put("/api/products/:id", (req, res) => {
  const { error } = validation(req.body);

  if (error) {
    return res.status(404).json({
      message: error.details[0].message,
    });
  }

  const index = products.findIndex((prod) => prod.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found with this id",
    });
  }

  products[index].name = req.body.name;
  products[index].price = req.body.price;

  return res.json({
    product: products[index],
  });
});

// update specific product data (using PATCH method)
app.patch("/api/products/:id", (req, res) => {
  const index = products.findIndex((prod) => prod.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      message: "Product not found with this id",
    });
  }

  let updateProduct = {
    ...products[index],
    ...req.body,
  };

  products[index] = updateProduct;
  return res.json(updateProduct);
});

// delete a specific product data
app.delete("/api/products/:id", (req, res) => {
  const product = products.find((prod) => prod.id === req.params.id);
  if (!product) {
    res.status(404).json({
      message: "Product not found with this id",
    });
  }

  const index = products.findIndex((prod) => prod.id === req.params.id);
  products.splice(index, 1);
  return res.json(product);
});

// delete all products data
app.delete("/api/products", (req, res) => {
  products.splice(0);
  return res.json(products);
});

// show list of products
// show specific products
// insert a product data
// update specific product data (using PUT method)
// update specific product data (using PATCH method)
// delete a specific product data
// delete all products data

function validation(body) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().required(),
  });

  return schema.validate(body);
}

app.listen(3000, () => console.log("Server is runing at port 3000"));
