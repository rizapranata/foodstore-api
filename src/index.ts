import express, { Request, Response } from "express";
import { MongoError } from "mongodb";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
const app = express();
const port = 3000;
import { loging } from "./middleware/log.js";
import errorhandling from "./middleware/errorHandling.js";
import client from "./connection.js"; // Import the MongoDB client
const upload = multer({ dest: "../public" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.use(loging);
app.use(express.json());

app.get("/post/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  res.send(`Hello World! Post ID: ${postId}`);
});

app.get("/foods", (req: Request, res: Response) => {
  const page = req.query.page ? req.query.page : 1;
  res.write(`Foods Page: ${page}\n`);
  if (req.query.sort) res.write(`Sorted by: ${req.query.sort}\n`);
  res.end();
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  res.send(
    `Hello World! User: ${username} ${
      password ? "with password" : "without password"
    }`
  );
});

app.post("/upload", upload.single("avatar"), (req: Request, res: Response) => {
  const avatar = req.file;
  const name = req.body.name;

  if (avatar) {
    const target = path.join(__dirname, "../public", avatar?.originalname);

    fs.renameSync(avatar.path, target);
    res.send({ name: name, avatar: avatar });
  } else {
    res.send(`avatar upload failed`);
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const db = client.db("foodstore");
    const products = await db.collection("product").find().toArray();
    res.send({
      status: "success",
      message: "List of products",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to fetch products",
      error: (error as MongoError).message,
    });
  }
});

app.get("/product/:id", (req: Request, res: Response) => {
  try {
    const db = client.db("foodstore");
    res.send("Menampilkan single product");
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Failed to fetch product",
      error: (error as MongoError).message,
    });
  }
});

app.use(errorhandling);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
