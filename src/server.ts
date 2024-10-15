import express, { Request, Response } from "express";
import router from "../routes/routes";

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  // res.render("index");
});

app.use("/api/v1/items", router);

app.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
});
