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
const crudRoutes_1 = require("../routes/crudRoutes");
const authRoutes_1 = require("../routes/authRoutes");
const router = express_1.default.Router();
router.all("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { action } = req.query;
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
    // Check if user is authorized, skip authorization methods
    if (!userId && action !== "login" && action !== "register") {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    // Choose appropriate function depending on performed action from query
    switch (action) {
        case "getItems":
            (0, crudRoutes_1.getItems)(req, res, userId);
            return;
        case "addItem":
            (0, crudRoutes_1.addItem)(req, res, userId);
            return;
        case "editItem":
            (0, crudRoutes_1.editItem)(req, res, userId);
            return;
        case "deleteItem":
            (0, crudRoutes_1.deleteItem)(req, res, userId);
            return;
        case "login":
            (0, authRoutes_1.login)(req, res);
            return;
        case "logout":
            (0, authRoutes_1.logout)(req, res);
            return;
        case "register":
            (0, authRoutes_1.register)(req, res);
            return;
        default:
            res.status(400).json({ error: "Invalid action" });
            return;
    }
}));
exports.default = router;
