import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "../public" });

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "../public", file?.originalname);
    fs.renameSync(file.path, target);
    res.send(file);
  } else {
    res.send(`File upload failed`);
  }
});
