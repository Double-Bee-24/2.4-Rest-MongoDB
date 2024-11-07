import express from "express";
import cors from "cors";
import { run } from "./database";
import bodyParser from "body-parser";
import router from "./router";
import session from "express-session";
import { authMiddleware } from "../middleware/authMiddleware";
const FileStore = require("session-file-store")(session);

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.0.199:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Configure session
app.use(
  session({
    store: new FileStore({ path: "./sessions" }),
    secret: "cat_parrot_fish",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 360000000, sameSite: "lax", secure: false }, // 100 hours
  })
);

app.set("view engine", "ejs");

app.use("/api/v2/router", authMiddleware, router);

run()
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is listening on http://localhost:3005");
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start the server due to database connection error:",
      error
    );
  });
