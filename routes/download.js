import express from "express";
import File from "../models/file.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("download", { error: "Link has been expired." });
  }

  const filePath = `${__dirname}/../${file.path}`;

  console.log("filePath :", filePath);

  res.download(filePath);
});

export default router;
