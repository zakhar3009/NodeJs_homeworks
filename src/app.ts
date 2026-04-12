import path from "node:path";

import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.use("/avatars", express.static(path.resolve("src", "uploads", "avatars")));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
