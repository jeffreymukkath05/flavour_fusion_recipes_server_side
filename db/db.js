// import mongodb client and server api version from the mongodb package
import { MongoClient, ServerApiVersion } from "mongodb";

// retrieve the mongodb uri from environment variables
const URI = process.env.MONGO_URI;
// check if the mongodb uri is missing and throw an error if it's not found
if (!URI) {
  throw new Error("mongodb uri is missing. please check your .env file");
}

// create a new instance of mongoclient with the provided URI and server api settings
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1, // use version 1 of the server api
    strict: true, // enable strict mode for better error handling
    deprecationErrors: true, // enable error reporting for deprecated features
  },
});

// initialize a variable to hold the database connection (null be default)
let db = null;

// define a function to connect to the database
export async function connect_db() {
  // if the database is already connected, return the existing connection
  if (db) return db;

  try {
    // attempt to connect to the mongodb server
    await client.connect();
    console.log("you successfully connected to mongodb");
    // assign the database reference to the db variable
    db = client.db("flavourfusionrecipes");
    return db; // return the database connection
  } catch (error) {
    // log and throw an error if the connection fails
    console.error("failed to connect to mongodb:", error);
    throw error;
  }
}

// listen for SIGINT (interrupt signal) to close the database connection gracefully
process.on("SIGINT", async () => {
  try {
    // attempt to close the mongodb client connection
    await client.close();
    console.log("mongodb connection closed");
    // exit the process once the connection is closed
    process.exit(0);
  } catch (error) {
    // log an error if closing the connection fails
    console.error("error closing mongodb connection:", error);
    // exit the process with a non-zero status code to indicate failure
    process.exit(1);
  }
});
