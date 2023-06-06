const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mogodb-practice.uoisaxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// API
app.get("/", (req, res) => {
  res.send("Do and Done Is Running...");
});

async function dataBase() {
  try {
    const todoCollection = client.db("do-and-done").collection("todos");

    // Add To-Do Into Database
    app.get("/get-todos", async (req, res) => {
      const query = {};
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });

    // Add To-Do Into Database
    app.post("/add-todo", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    // Change Status To Completed
    app.patch("/completed-todo/:_id", async (req, res) => {
      const { _id } = req.body;
      const result = await todoCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { status: "Completed" } }
      );
      res.send(result);
    });

    // Edit To-Do Information
    app.patch("/edit-todo/:_id", async (req, res) => {
      const _id = req.params._id;
      const todo = req.body;
      const result = await todoCollection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            taskName: todo.taskName,
            description: todo.description,
            addedTime: todo.addedTime,
          },
        }
      );
      res.send(result);
    });

    // Delete To-Do By Id
    app.delete("/delete-todo/:_id", async (req, res) => {
      const _id = req.params._id;
      const filter = { _id: new ObjectId(_id) };
      const result = await todoCollection.deleteOne(filter);
      res.send(result);
    });
  } catch (err) {
    console.log(err.message.bgRed.bold);
    console.log(err.stack.bgBlue.bold);
  }
}

dataBase().catch((err) => console.log(err.bold.bgRed));

// Listen
app.listen(port, () => console.log("Do and Done Server Is Running..."));
