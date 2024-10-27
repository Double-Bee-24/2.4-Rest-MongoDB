import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// need to access env variable safely
dotenv.config();

const uri = process.env.MONGODB_URI || "";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

export { client, run };
