import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import router from "../routes/routes";

const app = express();

// set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  // res.render("index");
});

app.use("/api/v1/items", router);

app.listen(3005, () => {
  console.log("Server is listening on http://localhost:3005");
});
