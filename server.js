import express from "express";
import connectDB from "./config/db.js";
import files from "./routes/files.js";
import show from "./routes/show.js";
import download from "./routes/download.js";
import path from "path";
import cors from "cors";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// path.dirname(__filename);

// process.cwd();

const app = express();
connectDB();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

//Template engine
const __dirname = path.resolve();
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Routes

app.use("/api/files", files);
app.use("/files", show);
app.use("/files/download", download);

app.get("/test", (req, res) => {
  res.send({ msg: "success" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
