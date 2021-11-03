import express from "express";
import multer from "multer";
import File from "../models/file.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sendMail from "../services/aap.js";
import emailTemplate from "../services/emailTemplate.js";

const router = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  //Validate request
  console.log(req.body);
  //Store file

  upload(req, res, async (err) => {
    console.log(req.file);
    if (!req.file) {
      return res.json({
        error: "All fields are required",
      });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //Store into Database

    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASH_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  console.log(emailFrom);

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
  }

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent" });
  }

  file.sender = "twentylightyear@gmail.com";
  file.receiver = emailTo;
  const response = await file.save();

  //Send email

  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Instant Share Files",
    text: `${emailFrom} shared a file with you.`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASH_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours",
    }),
  });

  return res.send({ success: true });
});

export default router;
