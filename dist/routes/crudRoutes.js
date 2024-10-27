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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.addItem = exports.editItem = exports.getItems = void 0;
const database_1 = require("../src/database");
const mongodb_1 = require("mongodb");
const todo_db = database_1.client.db("todo_db");
const todoItemsCollection = todo_db.collection("todoItemsCollection");
// Returns todo items list to frontend
const getItems = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todoItemsCollection
            .find({ userId: new mongodb_1.ObjectId(userId) })
            .toArray();
        res.status(200).json({ items: todos });
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
        const doc = { checked: false, text, userId: new mongodb_1.ObjectId(userId) };
        const result = yield todoItemsCollection.insertOne(doc);
        res.status(201).json({ id: result.insertedId });
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Cannot create item" });
    }
});
exports.addItem = addItem;
// Edites existing todo item
const editItem = (req, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, text, checked } = req.body;
        if (!id || text === undefined || checked === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }
        yield todoItemsCollection.updateOne({ _id: new mongodb_1.ObjectId(id), userId: new mongodb_1.ObjectId(userId) }, { $set: { text, checked } });
        res.status(200).json({ ok: true });
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
        yield todoItemsCollection.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            userId: new mongodb_1.ObjectId(userId),
        });
        res.send({ ok: true });
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Cannot delete item" });
    }
});
exports.deleteItem = deleteItem;
