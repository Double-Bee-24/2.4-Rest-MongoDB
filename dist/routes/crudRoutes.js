"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.addItem = exports.editItem = exports.getItems = void 0;
const database_1 = __importDefault(require("../src/database"));
// Returns todo items list to frontend
const getItems = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = "SELECT * FROM todos WHERE user_id = ?";
        database_1.default.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching todos:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).json({ items: results });
        });
    }
    catch (error) {
        console.error("Error sending data to the browser", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getItems = getItems;
// Creates and adds new todo item
const addItem = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        const query = "INSERT INTO todos (user_id, text) VALUES (?, ?)";
        database_1.default.query(query, [userId, text], (err, results) => {
            if (err) {
                console.error("Error creating item:", err);
                return res.status(500).json({ error: "Cannot create item" });
            }
            res.status(201).json({ id: results.insertId });
        });
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Cannot create item" });
    }
});
exports.addItem = addItem;
// Edits existing todo item
const editItem = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, text, checked } = req.body;
        if (!id || text === undefined || checked === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const query = "UPDATE todos SET text = ?, checked = ? WHERE id = ? AND user_id = ?";
        database_1.default.query(query, [text, checked, id, userId], (err) => {
            if (err) {
                console.error("Error updating item:", err);
                return res.status(500).json({ error: "Cannot update item" });
            }
            res.status(200).json({ ok: true });
        });
    }
    catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Cannot update item" });
    }
});
exports.editItem = editItem;
// Deletes todo item from database
const deleteItem = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Missing id" });
        }
        const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
        database_1.default.query(query, [id, userId], (err) => {
            if (err) {
                console.error("Error deleting item:", err);
                return res.status(500).json({ error: "Cannot delete item" });
            }
            res.send({ ok: true });
        });
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Cannot delete item" });
    }
});
exports.deleteItem = deleteItem;
