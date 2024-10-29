import { Request, Response } from "express";
import { RowDataPacket } from "mysql2/promise";
import connection from "../src/database";
import bcrypt from "bcrypt";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query<RowDataPacket[]>(query, [email], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      req.session.user = {
        id: user.id,
        email: user.email,
      };

      res.status(200).json({ ok: true });
    });
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
    const queryCheck = "SELECT * FROM users WHERE email = ?";
    connection.query<RowDataPacket[]>(
      queryCheck,
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error checking user:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword };
        const queryInsert = "INSERT INTO users (email, password) VALUES (?, ?)";

        connection.query(
          queryInsert,
          [newUser.email, newUser.password],
          (err, results) => {
            if (err) {
              console.error("Error registering user:", err);
              return res.status(500).json({ error: "Error registering user" });
            }
            res.status(201).json({ ok: true });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { login, logout, register };
