// import express framework for creating the api
import express from "express";
// import bcryptjs for hashing password
import bcrypt from "bcryptjs";
// import the function to connect to the mongodb database
import { connect_db } from "../db/db.js";

// create a new router instance to define routes separately
const router = express.Router();

// helper function to validate email format using regex
const is_valid_email = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// helper function to check if a password is strong (minimum 9 characters)
const is_strong_password = (password) =>
  typeof password === "string" && password.length >= 9;

// define a route to handle user registration
router.post("/register", async (req, res) => {
  // extract user details from the request body
  const { first_name, last_name, email, password } = req.body;

  // check if any required field is missing
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "all fields are required" });
  }

  // validate email format
  if (!is_valid_email(email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  // validate password strength
  if (!is_strong_password(password)) {
    return res
      .status(400)
      .json({ error: "password must be at least 9 characters long" });
  }

  try {
    // connect to the database
    const db = await connect_db();
    // get the "users" collection
    const users = db.collection("users");

    // check if a user with the same email already exists
    const existing_user = await users.findOne({
      email: email.toLowerCase(),
    });
    // if user exists, respond with a conflict error
    if (existing_user) {
      return res.status(409).json({ error: "email already exists" });
    }

    // hash the password using bcrypt with a salt round of 10
    const hashed_password = await bcrypt.hash(password, 10);

    // create a new user object
    const new_user = {
      profile_picture:
        "https://res.cloudinary.com/de74jeqj6/image/upload/v1746422098/xnsujseztlwg0wn4g433.png",
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashed_password,
      admin: false, // set admin to false by default
    };

    // insert the new user into the database
    const result = await users.insertOne(new_user);
    // respond with a success message and inserted user's id
    res.status(201).json({
      message: "user registered successfully",
      user_id: result.insertedId,
    });
  } catch (error) {
    // log and respond with a generic server error
    console.error("registration error:", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

// define a route to handle user login
router.post("/login", async (req, res) => {
  // extract email and password from the request body
  const { email, password } = req.body;

  // check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  // validate email format
  if (!is_valid_email(email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  // check if the password is a non-empty string
  if (typeof password !== "string" || password.length < 1) {
    return res.status(400).json({ error: "password must be provided" });
  }

  try {
    // connect to the database
    const db = await connect_db();
    // get the "users" collection
    const users = db.collection("users");

    // find a user with the matching email (case - insensitive)
    const user = await users.findOne({
      email: email.toLowerCase(),
    });

    // check if the user exists and the password matches
    const password_match =
      user && (await bcrypt.compare(password, user.password));

    // if no user is found or password doesn't match, return unauthorized error
    if (!user || !password_match) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    // if login is successful, return a success message with the user id
    res.status(200).json({
      message: "login successful",
      user_id: user._id,
    });
  } catch (error) {
    // log any errors and return a server error response
    console.error("login error:", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

// export the router to use in other parts of the app
export default router;
