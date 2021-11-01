import express from "express";
import File from "../models/file.js";

const router = express.Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    console.log("file :", file);
    if (!file) {
      return res.render("download", { error: "file is missing" });
    }
    return res.render("download", {
      uuid: file.uuid,
      filename: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASH_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    // console.log(err);
    return res.render("download", { error: "Something is wrong :( !!!!" });
  }
});

export default router;
