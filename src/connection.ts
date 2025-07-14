import { MongoClient, MongoError } from "mongodb";

const uri =
  "mongodb://rizapranata:rahasia@localhost:27017/foodstore?authSource=admin";
const client = await MongoClient.connect(uri, {});

(async () => {
  try {
    await client.connect();
    console.log("Menampilkan list product");
  } catch (error) {
    console.error(error);
  }
})();

export default client;
