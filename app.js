import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import viewEngine from "./config/viewEngine.js";
import initWebRoute from "./routes/web.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
  path: "./config/.env",
});
let app = express();
// config view engine
viewEngine(app);

console.log(/[0-9]{7}/.test("+0843987789 kjskdk"));

//use body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// init all web routes
initWebRoute(app);

let port = process.env.PORT || 8080;
app.use((error, req, res, next) => {
  res.json({ message: error });
});
app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
