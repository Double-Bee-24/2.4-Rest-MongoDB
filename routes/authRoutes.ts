import { Request, Response } from "express";
import { client } from "../src/database";
import bcrypt from "bcrypt";

const todo_db = client.db("todo_db");
const usersList = todo_db.collection("usersList");

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await usersList.findOne({ email });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
};

const logout = async (req: Request, res: Response) => {
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
};

const register = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const existingUser = await usersList.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };

    await usersList.insertOne(newUser);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

export { login, logout, register };
