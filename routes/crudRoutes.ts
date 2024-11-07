import { Response, Request } from "express";
import { client } from "../src/database";
import { ObjectId } from "mongodb";

const todo_db = client.db("todo_db");
const todoItemsCollection = todo_db.collection("todoItemsCollection");

// Returns todo items list to frontend
const getItems = async (req: Request, res: Response, userId: string) => {
  try {
    const todos = await todoItemsCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();
    res.status(200).json({ items: todos });
  } catch (error) {
    console.error("Error sending data to the browser", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Creates and adds new todo item
const addItem = async (req: Request, res: Response, userId: string) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const doc = { checked: false, text, userId: new ObjectId(userId) };
    const result = await todoItemsCollection.insertOne(doc);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Cannot create item" });
  }
};

// Edites existing todo item
const editItem = async (req: Request, res: Response, userId: string) => {
  try {
    const { id, text, checked } = req.body;
    if (!id || text === undefined || checked === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }
    await todoItemsCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: { text, checked } }
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Cannot update item" });
  }
};

// Deletes todo item from database
const deleteItem = async (req: Request, res: Response, userId: string) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    await todoItemsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });
    res.send({ ok: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Cannot delete item" });
  }
};

// export default router;
export { getItems, editItem, addItem, deleteItem };
