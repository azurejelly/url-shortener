import type { Express } from "express"
import { isDevelopment } from "../utils/environment";
import session from "express-session";

declare module "express-session" {
    interface Session {
        messages: string[]
    }
}

const sessionSettings = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "meow",
    cookie: {
        secure: false
    }
};

export const configure = (app: Express) => {
    if (!isDevelopment) {
        app.set('trust proxy', true);
        sessionSettings.cookie.secure = true;
    }
    
    app.use(session(sessionSettings));
}