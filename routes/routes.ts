import express, { Response, Request } from "express";
import fs from "fs";

interface ITodo {
  id: number;
  text: string;
  checked: boolean;
}

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  fs.readFile("./data/dataBase.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error while reading file");
    }
    const items = JSON.parse(data);
    res.send({ items });
  });
});

router.post("/", (req: Request, res: Response) => {
  if (req.body) {
    fs.readFile("./data/dataBase.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error while reading file");
      }
      const todos = JSON.parse(data);
      const { text } = req.body;
      const newId = todos.at(-1).id + 1;
      todos.push({ id: newId, text, checked: false });
      console.log(text);

      fs.writeFile("./data/dataBase.json", JSON.stringify(todos), (err) => {
        if (err) {
          return res.status(500).send("Error whilre writing file");
        }
        res.send({ id: newId });
      });
    });
  }
});

router.put("/", (req: Request, res: Response) => {
  if (req.body) {
    fs.readFile("./data/dataBase.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error while reading file");
      }
      const todos = JSON.parse(data);
      const { id, text, checked } = req.body;
      const updatedTodos = todos.map((item: ITodo) =>
        item.id === id ? { ...item, checked, text } : item
      );

      fs.writeFile(
        "./data/dataBase.json",
        JSON.stringify(updatedTodos),
        (err) => {
          if (err) {
            return res.status(500).send("Error whilre writing file");
          }
          res.send({ ok: true });
        }
      );
    });
  }
});

router.delete("/", (req: Request, res: Response) => {
  fs.readFile("./data/dataBase.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error while reading file");
    } else {
      const idToDelete = req.body.id;
      const todos = JSON.parse(data);
      const filtredTodos = todos.filter(
        (item: { id: number }) => item.id !== idToDelete
      );

      fs.writeFile(
        "./data/dataBase.json",
        JSON.stringify(filtredTodos),
        (err) => {
          if (err) {
            return res.status(500).send("Error whilre writing file");
          }
          res.send({ ok: true });
        }
      );
    }
  });
});

export default router;
