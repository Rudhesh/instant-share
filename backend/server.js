import express from "express";
import connectDB from "./config/db.js";
import files from "./routes/files.js";
import show from "./routes/show.js";
import download from "./routes/download.js";
import path from "path";

const app = express();
connectDB();
app.use(express.static("public"));
app.use(express.json());

//Template engine
const __dirname = path.resolve();
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Routes

app.use("/api/files", files);
app.use("/files", show);
app.use("/files/download", download);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
