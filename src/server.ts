import "dotenv/config";
import express from "express";
import rootPath from "app-root-path";
import logger from "./lib/logger";
import morgan from "./middleware/morgan.middleware";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import redirects from "./routes/redirects";
import admin from "./routes/admin";
import api from "./routes/api";
import { setupSampleUser } from "./lib/environment";
import * as passportConfig from "./config/passport";
import * as sessionConfig from "./config/session";
import flash from "connect-flash";

setupSampleUser();

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash());
sessionConfig.configure(app);
passportConfig.configure(app);
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');
app.use(express.static('public'));
app.use(admin);
app.use(api);
app.use(redirects);
app.use(notFoundHandler, errorHandler);

app.listen(port, () => logger.info(`listening @ 127.0.0.1:${port}`));