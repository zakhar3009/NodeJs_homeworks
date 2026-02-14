import express from "express";

import routes from "./routes";

const app = express();

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
