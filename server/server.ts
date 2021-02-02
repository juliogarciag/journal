import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import getDailyEntries from "./queries/getDailyEntries";
import getMetrics from "./queries/getMetrics";
import getEntryTypes from "./queries/getEntryTypes";
import getIfEntryCanBeDeleted from "./queries/getIfEntryCanBeDeleted";
import updateEntry from "./mutations/updateEntry";
import createEntryType from "./mutations/createEntryType";
import updateEntryType from "./mutations/updateEntryType";
import deleteEntryType from "./mutations/deleteEntryType";
import cors from "cors";
import getMetricTemplates from "queries/getMetricTemplates";
import createMetricTemplate from "mutations/createMetricType";
import updateMetricTemplate from "mutations/updateMetricTemplate";
import deleteMetricTemplate from "mutations/deleteMetricTemplate";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_DOMAIN =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "TODO";

app.use(
  cors({
    origin: CLIENT_DOMAIN,
    methods: ["GET", "PATCH", "POST", "DELETE"],
  })
);

app.get("/daily-entries/:day", getDailyEntries);
app.get("/metrics", getMetrics);
app.get("/entry-types", getEntryTypes);
app.get("/entry-types/:entryTypeId/can-be-deleted", getIfEntryCanBeDeleted);
app.get("/metric-templates", getMetricTemplates);

app.patch("/entries/:entryId", updateEntry);
app.post("/entry-types", createEntryType);
app.patch("/entry-types/:entryTypeId", updateEntryType);
app.delete("/entry-types/:entryTypeId", deleteEntryType);
app.post("/metric-templates", createMetricTemplate);
app.patch("/metric-templates/:metricTemplateId", updateMetricTemplate);
app.delete("/metric-templates/:metricTemplateId", deleteMetricTemplate);

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

["exit", "SIGINT", "uncaughtException", "SIGTERM"].forEach((eventType) => {
  process.on(eventType, () => {
    server.close();
  });
});
