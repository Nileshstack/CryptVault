import { MongoClient } from 'mongodb'

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB || 'madquick'

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(url)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function getDb() {
  const conn = await clientPromise
  return conn.db(dbName)
}
