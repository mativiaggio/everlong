import express from "express";
import connect from "./db/db_connection.js";
import handlebars from "express-handlebars";
import { getPath } from "../utils/functions.js";
import { addLogger } from "../middlewares/addLogger.middleware.js";
import { PORT } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Importing routes
import adminRouter from "../routes/admin/admin.router.js";

// Iniciar express
const app = express();

// MongoDB connection
connect();

// App
app.use(addLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(getPath("public")));

// Handlebars configuration
app.engine("handlebars", handlebars.engine());
app.set("views", `${getPath("views")}`);
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  logger.info(`Server running http://localhost:${PORT}/`);
});
