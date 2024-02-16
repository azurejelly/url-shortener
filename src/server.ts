import "dotenv/config";
import express, { NextFunction, Request } from "express";
import rootPath from "app-root-path";
import logger from "./lib/logger";
import morgan from "./middleware/morgan.middleware";
import { notFoundHandler, errorHandler } from "./middleware/errors";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(morgan);
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');
app.use(express.static('public'));

app.get('/', (_, res) => {
    res.send(`Hello world!`);
});

app.get('/err', (_req, _res) => {
    throw new Error("This is an example error");
})

app.use(notFoundHandler, errorHandler);

app.listen(port, () => logger.info(`Listening @ 127.0.0.1:${port}`));