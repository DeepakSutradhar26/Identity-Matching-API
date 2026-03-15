import express from "express";
import cors from "cors";
import { identityMatching } from "./routes/identifyContacts";

const app = express();

app.use(express.json());

app.use(cors());

app.use(cors({
    origin : "https://identity-matching-ui.vercel.app"
}));

app.post('/identify', identityMatching);

export default app;