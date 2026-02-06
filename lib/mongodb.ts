import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV !== "development") {
  client = new MongoClient(mongoUri);
  clientPromise = client.connect();
} else {
  if (!global._mongoClientPromise) {
    client = new MongoClient(mongoUri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
