import express from "express";
import path from "path";
import { identityMatching } from "./routes/identifyContacts";

const app = express();

app.use(express.json());

app.post('/identify', identityMatching);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export default app;