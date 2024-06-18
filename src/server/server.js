import express from "express";
import connect from "./db/db_connection.js";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import initializePassport from "../config/passport.config.js";
import passport from "passport";
import flash from "connect-flash";
import { getPath } from "../utils/functions.js";
import { addLogger } from "../middlewares/addLogger.middleware.js";
import { PORT, MONGO_URI } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { setLayout } from "../middlewares/setLayout.middleware.js";
import hbs from "../config/handlebars.config.js";
import path from "path";
import { fileURLToPath } from "url";

// Importing routes
import adminRouter from "../routes/admin/admin.router.js";
import clientRouter from "../routes/client/client.router.js";
import adminSessionRouter from "../routes/api/admin/session.router.js";
import adminProductsRouter from "../routes/api/admin/products.router.js";
import adminUserRouter from "../routes/api/admin/user.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Iniciar express
const app = express();

// MongoDB connection
connect();

// App

// Session middleware
app.use(cookieParser());
app.use(
  session({
    secret: "ourSecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Passport initialization
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");
// app.set("views", `${getPath("views")}`);

const viewsPath = path.resolve(__dirname, "../views");
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", viewsPath);

app.use(setLayout);

// Routes
app.use("/api/admin/sessions", adminSessionRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/admin", adminRouter);
app.use("/", clientRouter);

app.listen(PORT, () => {
  logger.info(`Server running http://localhost:${PORT}/`);
});
