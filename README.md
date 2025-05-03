# flavour_fusion_recipes_server_side

## description

flavour_fusion_recipes is a full-stack web application focused on helping users discover, share, and manage recipes from various cultures and dietary preferences. this repository contains the server-side code built with mern stack. it provides a restful api for user authentication, recipe management, and other backend services. the backend is designed with scalability, modularity, and security in mind.

## table of contents

- [tech stack](#tech-stack)
- [features](#features)
- [installation](#installation)
- [api documentation](#api-documentation)
- [usage examples](#usage-examples)
- [acknowledgments](#acknowledgments)

## tech stack

- node.js - javascript runtime
- express.js - fast and minimalist backend framework
- mongodb - document database accessed using the official mongodb node.js driver
- jsonwebtoken (jwt) - for stateless authentication
- bcryptjs - for password hashing
- cloudinary - for handling image uploads

## features

- full crud operations for recipes
- user registration, login, and authentication using jwt
- hashed password storage
- token-based protected routes
- role-based access control (admin, user)
- image upload and storage (cloud support ready)
- search and filter for recipes
- centralized error handling and custom middleware

## installation

1. clone the repository

   ```
   git clone https://github.com/jeffreymukkath05/flavour_fusion_recipes_server_side.git
   ```

2. navigate into the directory

   ```
   cd flavour_fusion_recipes_server_side
   ```

3. install dependencies

   ```
   npm install
   ```

4. create a **.env** file and add the following variables

   ```
   PORT = 5000
   MONGO_URI = your_mongodb_connection_string
   JWT_SECRET = your_secret_key
   ```

5. start the server

   ```
   npm start
   ```

## api documentation

**auth routes**

| method | route              | description           | protected |
| ------ | ------------------ | --------------------- | --------- |
| post   | /api/auth/register | create user account   | no        |
| post   | /api/auth/login    | login and receive jwt | no        |

**recipe routes**

| method | route            | description       | protected |
| ------ | ---------------- | ----------------- | --------- |
| get    | /api/recipes/    | get all recipes   | no        |
| get    | /api/recipes/:id | get single recipe | no        |
| post   | /api/recipes/    | create a recipe   | yes       |
| put    | /api/recipes/:id | update recipe     | yes       |
| delete | /api/recipes/:id | delete recipe     | yes       |

## usage examples

**register user**

    post /api/auth/register
    {
        "first_name": "jeffrey",
        "last_name": "mukkath",
        "email": "jeffreymukkath65@gmail.com",
        "password": "strongpassword"
    }

**login**

    post /api/auth/login
    {
        "email": "jeffreymukkath65@gmail.com",
        "password": "strongpassword"
    }

**create recipe (jwt token required)**

    post /api/recipes/
    headers: { authorization: bearer <jwt_token> }
    {
        "title": "chicken curry",
        "short_description": "great curry",
        "author_name": "jeffrey mukkath",
        "ingredients": ["chicken", "onion", "garlic"],
        "instructions": ["cook chicken with spices.", "garnish and serve hot."],
        "category": "indian"
    }

## acknowledgments

- node.js documentation
- express.js documentation
- mongodb documentation
- the open source community for great libraries and tools
