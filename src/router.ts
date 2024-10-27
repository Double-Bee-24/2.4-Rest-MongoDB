import express, { Response, Request } from "express";
import { getItems, addItem, editItem, deleteItem } from "../routes/crudRoutes";
import { login, logout, register } from "../routes/authRoutes";

const router = express.Router();

router.all("/", async (req: Request, res: Response) => {
  const { action } = req.query;
  const userId = req.session.user?.id;

  // Check if user is authorized, skip authorization methods
  if (!userId && action !== "login" && action !== "register") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Choose appropriate function depending on performed action from query
  switch (action) {
    case "getItems":
      getItems(req, res, userId);
      return;
    case "addItem":
      addItem(req, res, userId);
      return;
    case "editItem":
      editItem(req, res, userId);
      return;
    case "deleteItem":
      deleteItem(req, res, userId);
      return;
    case "login":
      login(req, res);
      return;
    case "logout":
      logout(req, res);
      return;
    case "register":
      register(req, res);
      return;
    default:
      res.status(400).json({ error: "Invalid action" });
      return;
  }
});

export default router;
