// import express framework for creating the api
import express from "express";
// import objectid to work with mongodb document ids
import { ObjectId } from "mongodb";
// import the function to connect to the mongodb database
import { connect_db } from "../db/db.js";

// create a new router instance to define routes separately
const router = express.Router();

// connect to the database
const db = await connect_db();
// get the "recipes" collection
const recipes = db.collection("recipes");

// helper function to return the current date in dd/mm/yyyy format
function get_numeric_date() {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

// route to get all recipes from the database
router.get("/", async (req, res) => {
  try {
    const all_available_recipes = await recipes.find().toArray();
    res.json(all_available_recipes);
  } catch (error) {
    // handle and log any errors while fetching recipes
    console.error("error fetching recipes:", error);
    res.status(500).json({ error: "failed to fetch recipes" });
  }
});

// route to get a single recipe by its id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // check if the provided id is a valid mongodb object id
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "invalid recipe id" });
  }

  try {
    // try to find the recipe by id
    const recipe = await recipes.findOne({ _id: new ObjectId(id) });
    // if recipe is not found, respond with 404
    if (!recipe) return res.status(404).json({ error: "recipe not found" });
    // send the found recipe
    res.json(recipe);
  } catch (error) {
    // handle and log any errors while fetching recipe
    console.error("error fetching recipe by id:", error);
    res.status(400).json({ error: "failed to fetch recipe" });
  }
});

// route to create a new recipe
router.post("/", async (req, res) => {
  // extract recipe data from the request body
  const {
    title,
    short_description,
    author_name,
    long_description,
    ingredients,
    instructions,
  } = req.body;

  // check if any required field is missing
  if (
    !title ||
    !short_description ||
    !author_name ||
    !long_description ||
    !ingredients ||
    !instructions
  ) {
    return res.status(400).json({ error: "all fields are required" });
  }

  // validate that ingredients is an array of strings
  if (
    !Array.isArray(ingredients) ||
    ingredients.some((i) => typeof i !== "string")
  ) {
    return res
      .status(400)
      .json({ error: "ingredients must be an array of strings" });
  }

  // create a new recipe object with cleaned inputs
  const new_recipe = {
    title: title.trim(),
    short_description: short_description.trim(),
    author_name: author_name.trim(),
    long_description: long_description.trim(),
    ingredients: ingredients.map((i) => i.trim()),
    instructions: instructions.trim(),
    created_at: get_numeric_date(), // add the current date
  };

  try {
    // insert the new recipe into the database
    const result = await recipes.insertOne(new_recipe);
    // respond with a success message and the new recipe id
    res
      .status(201)
      .json({ message: "recipe created", recipe_id: result.insertedId });
  } catch (error) {
    // handle and log any errors while creating the recipe
    console.error("error creating recipe:", error);
    res.status(500).json({ error: "failed to create recipe" });
  }
});

// export the router to use in other parts of the app
export default router;
