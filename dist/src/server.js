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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const FileStore = require("session-file-store")(express_session_1.default);
const authMiddleware_1 = require("../middleware/authMiddleware");
const database_1 = __importDefault(require("./database"));
const router_1 = __importDefault(require("./router"));
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
app.get("/", (req, res) => {
    res.send("Сервер працює!");
});
const showResult = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.promise().query("SELECT * FROM users");
    console.log(rows);
});
app.listen(3005, () => {
    console.log(`Server is running at http://localhost:${3005}`);
});
showResult();
