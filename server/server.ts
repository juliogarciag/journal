import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import getDailyEntries from "./queries/getDailyEntries";
import updateEntry from "./mutations/updateEntry";
import getMetrics from "./queries/getMetrics";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_DOMAIN =
  process.env.NODE_ENV !== "production" ? "http://localhost:8080" : "TODO";

app.use(
  cors({
    origin: CLIENT_DOMAIN,
    methods: ["GET", "PATCH", "POST", "DELETE"],
  })
);

app.get("/daily-entries/:day", getDailyEntries);
app.get("/metrics", getMetrics);
app.patch("/entries/:entryId", updateEntry);

app.listen(port, () => console.log(`Listening on port ${port}`));
