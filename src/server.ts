import "dotenv/config";
import express, { NextFunction, Request } from "express";
import rootPath from "app-root-path";
import logger from "./lib/logger";
import morgan from "./middleware/morgan.middleware";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import redirects from "./routes/redirects";
import admin from "./routes/admin";
import api from "./routes/api";
import prisma from "./lib/database";
import { generateRandomString } from "./utils/random"

const sampleUser = {
    name: "Nekoture",
    email: "me@nekoture.xyz",
    key: generateRandomString(32)
};

(async() => {
    await prisma.user.delete({ where: { email: "me@nekoture.xyz" }})
    await prisma.user.create({ data: sampleUser })
        .then(() => {
            logger.info(`Generated random user with info: ${JSON.stringify(sampleUser)}`);
        });
})();

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(express.json());
app.use(morgan);
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');
app.use(express.static('public'));
app.use(admin);
app.use(api);
app.use(redirects);
app.use(notFoundHandler, errorHandler);

app.listen(port, () => logger.info(`Listening @ 127.0.0.1:${port}`));