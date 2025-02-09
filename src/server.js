import express from "express";
import config from "config";
import photographersRoutes from "./routes/photographers.routes.js";
import distributorsRoutes from "./routes/distributors.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
const PORT = config.get("port");

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PATCH,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use("/api/photographers", photographersRoutes);
app.use("/api/distributors", distributorsRoutes);
app.use("/api/clients", clientsRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
