import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

// Create Express App
const app = express();

// Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("**DB Connected**"))
  .catch((err) => console.log("DB Connection Error => ", err));

// Apply Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// app.use((req, res, next) => {
//   console.log("This is my own middleware");
//   next();
// });

// Route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
