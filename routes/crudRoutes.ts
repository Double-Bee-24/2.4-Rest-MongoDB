import { Response, Request } from "express";
import { ResultSetHeader } from "mysql2/promise";
import connection from "../src/database";

// Returns todo items list to frontend
const getItems = async (req: Request, res: Response, userId: string) => {
  try {
    const query = "SELECT * FROM todos WHERE user_id = ?";
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching todos:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ items: results });
    });
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
    const query = "INSERT INTO todos (user_id, text) VALUES (?, ?)";
    connection.query<ResultSetHeader>(query, [userId, text], (err, results) => {
      if (err) {
        console.error("Error creating item:", err);
        return res.status(500).json({ error: "Cannot create item" });
      }
      res.status(201).json({ id: results.insertId });
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Cannot create item" });
  }
};

// Edits existing todo item
const editItem = async (req: Request, res: Response, userId: string) => {
  try {
    const { id, text, checked } = req.body;
    if (!id || text === undefined || checked === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const query =
      "UPDATE todos SET text = ?, checked = ? WHERE id = ? AND user_id = ?";
    connection.query(query, [text, checked, id, userId], (err) => {
      if (err) {
        console.error("Error updating item:", err);
        return res.status(500).json({ error: "Cannot update item" });
      }
      res.status(200).json({ ok: true });
    });
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
    const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
    connection.query(query, [id, userId], (err) => {
      if (err) {
        console.error("Error deleting item:", err);
        return res.status(500).json({ error: "Cannot delete item" });
      }
      res.send({ ok: true });
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Cannot delete item" });
  }
};

export { getItems, editItem, addItem, deleteItem };
