import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
let client: MongoClient

if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri)
}

client = global._mongoClient
export default client.connect()