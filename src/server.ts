import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
const FileStore = require("session-file-store")(session);
import { authMiddleware } from "../middleware/authMiddleware";
import router from "./router";

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
    cookie: { maxAge: 360000000, sameSite: "lax", secure: false }, // 100 hour
  })
);

app.set("view engine", "ejs");

app.use("/api/v2/router", authMiddleware, router);

app.listen(3005, () => {
  console.log(`Server is running at http://localhost:${3005}`);
});
