import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

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
app.use(morgan("dev"));
// app.use((req, res, next) => {
//   console.log("This is my own middleware");
//   next();
// });

// Route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
