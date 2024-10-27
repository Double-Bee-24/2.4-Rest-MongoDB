"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const express_session_1 = __importDefault(require("express-session"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const FileStore = require("session-file-store")(express_session_1.default);
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://192.168.0.199:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));
// Set up body-parser
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
// Configure session
app.use((0, express_session_1.default)({
    store: new FileStore({ path: "./sessions" }),
    secret: "cat_parrot_fish",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 360000000, sameSite: "lax", secure: false }, // 100 hour
}));
app.set("view engine", "ejs");
app.use("/api/v2/router", authMiddleware_1.authMiddleware, router_1.default);
(0, database_1.run)()
    .then(() => {
    app.listen(3005, () => {
        console.log("Server is listening on http://localhost:3005");
    });
})
    .catch((error) => {
    console.error("Failed to start the server due to database connection error:", error);
});
