import mongoose from "mongoose";

const uri =
  "mongodb://rizapranata:rahasia@localhost:27017/foodstore?authSource=admin";
mongoose.connect(uri, {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stok: Number,
  status: Boolean,
});

const Product = mongoose.model("Product", productSchema);

const product =  new Product({
  name: "Nasi Goreng",
  price: 15000,
  stok: 100,
  status: true,
});

product.save()
  .then(() => console.log("Product saved"))
  .catch(err => console.error("Error saving product:", err));

export { Product };
