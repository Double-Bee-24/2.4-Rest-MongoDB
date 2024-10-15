import express, { Response, Request } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send({ items: [{ id: 22, text: "...", checked: true }] });
});
router.post("/", (req: Request, res: Response) => {
  res.send({ id: 23 });
});
router.put("/", (req: Request, res: Response) => {
  res.send("put");
});
router.delete("/", (req: Request, res: Response) => {
  res.send("delete");
});

export default router;
