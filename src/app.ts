import express from "express";
import { identityMatching } from "./routes/identifyContacts";

const app = express();

app.use(express.json());

app.post('/identify', identityMatching);

export default app;