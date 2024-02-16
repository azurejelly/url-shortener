import "dotenv/config";
import express from "express";
import rootPath from "app-root-path";
import logger from "./lib/logger";
import morgan from "./middleware/morgan.middleware";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import redirects from "./routes/redirects";
import admin from "./routes/admin";
import api from "./routes/api";
import prisma from "./lib/database";
import { generateRandomString } from "./utils/random"
import { isDevelopment } from "./utils/environment";
import session from "express-session";
import { encryptPassword } from "./lib/auth.helper";

if (isDevelopment) {
    const sampleUser = {
        name: "Nekoture",
        email: "me@nekoture.xyz",
        password: encryptPassword("password"),
        key: generateRandomString(32)
    };
    
    (async() => {
        await prisma.user.delete({ where: { email: "me@nekoture.xyz" }})
            .catch((err) => logger.warn(`Failed to delete sample user!`));

        await prisma.user.create({ data: sampleUser })
            .then(() => {
                logger.info(`generated random user with info: ${JSON.stringify(sampleUser)}`);
            });
    })();
}

const app = express();
const port = parseInt(process.env.PORT || "3000");
const sessionSettings = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "meow",
    cookie: {
        secure: false
    }
};

if (!isDevelopment) {
    app.set('trust proxy', true);
    sessionSettings.cookie.secure = true;
}

app.use(morgan);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');
app.use(express.static('public'));
app.use(session(sessionSettings));
app.use(admin);
app.use(api);
app.use(redirects);
app.use(notFoundHandler, errorHandler);

app.listen(port, () => logger.info(`listening @ 127.0.0.1:${port}`));