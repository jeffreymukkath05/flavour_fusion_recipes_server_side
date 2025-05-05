// import the express framework
import express from "express";
// import and configure environment variables from a .env file
import "dotenv/config";
import user_route from "./routes/user_route.js";

// create an instance of an express application
const app = express();
// set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// enable the app to parse incoming json requests
app.use(express.json());

// define a route for the root path that sends a simple text response
app.get("/", (req, res) => {
  res.send("hello, world!");
});

// use the user_route module to handle all routes starting with /api/auth
app.use("/api/auth", user_route);

// start the server and listen on the defined port
app
  .listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    // handle errors that occur when starting the server
    console.error("failed to start server:", err);
  });
