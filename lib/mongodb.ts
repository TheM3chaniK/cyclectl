import clientPromise from './mongo';

const dbName = process.env.MONGODB_DB;

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}
