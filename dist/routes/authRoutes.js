"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.logout = exports.login = void 0;
const database_1 = require("../src/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const todo_db = database_1.client.db("todo_db");
const usersList = todo_db.collection("usersList");
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const user = yield usersList.findOne({ email });
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      const isPasswordValid = yield bcrypt_1.default.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(401).send("Unauthorized");
        return;
      }
      req.session.user = {
        id: user._id,
        email: user.email,
      };
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
exports.login = login;
const logout = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Error logging out" });
        }
        res.status(200).json({ ok: true });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
exports.logout = logout;
const register = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { password, email } = req.body;
      const existingUser = yield usersList.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      const newUser = { email, password: hashedPassword };
      yield usersList.insertOne(newUser);
      res.status(201).json({ ok: true });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  });
exports.register = register;
