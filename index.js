import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.config.js";
import routes from "./routes/api.routes.js";
import webRoutes from "./routes/web.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pastebin-2-0.vercel.app" ]
  })
);

app.use(express.json());

app.use("/api", routes);

app.use("/", webRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
