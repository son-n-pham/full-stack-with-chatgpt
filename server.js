// Import the express module
const express = require("express");

// Create an instance of express
const app = express();

// Import the mongoose module
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://sonpn1982_Mongo:Thnalath0223@cluster0.fh8rkjv.mongodb.net/?retryWrites=true&w=majority";

// Connect to a MongoDB database
async function connect() {
  try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();

// use Mongoose to define your data models and interact with your MongoDB database. For example, you can create a simple schema for a user
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Define a GET route for the root endpoint
app.get("/", (req, res) => {
  // Respond with "Hello, World!"
  res.send("Hello, World!");
});

// Start the server on port 3000
app.listen(3000, () => {
  // Log the message "Server running on port 3000"
  console.log("Server running on port 3000");
});

//////////////////////////////////
// Create a new user
const bcrypt = require("bcrypt");

function add_user(username, password) {
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      return error;
    }

    const user = new User({
      username,
      password: hash,
    });

    user.save((error) => {
      if (error) {
        return res.status(500).send(error);
      }
      console.log("New user is added to database");
      return user;
    });
  });
}

const user = {
  username: "sonn",
  password: "12345",
};
add_user(user.username, user.password);

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  add_user(username, password);
});

/////////////////////////////////////
// Get all users
app.get("/users", (req, res) => {
  User.find((error, users) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.send(users);
  });
});

/////////////////////////////////////
// Update a user by id
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  User.findByIdAndUpdate(
    userId,
    updatedUserData,
    { new: true },
    (error, user) => {
      if (error) {
        return res.status(500).send(error);
      }

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.send(user);
    }
  );
});

//////////////////////////////////////
// Delete a user by id
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId, (error, user) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send({ message: "User deleted" });
  });
});
