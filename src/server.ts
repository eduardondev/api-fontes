import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(process.env.PORT, () =>
  console.log(`---> API running on ${process.env.PORT} PORT`)
);
