import passport from "passport";
import passportLocal from "passport-local";
import type { Express } from "express";
import prisma from "../lib/prisma";
import { compare } from "../lib/password";
import logger from "../lib/logger";

const LocalStrategy = passportLocal.Strategy;

export const configure = (app: Express) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user: any, done) {
        done(null, user);
    });
    
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, async(email, password, done) => {
        const user = await prisma.user.findFirst({ where: { email: email }});

        if (!user) {
            logger.debug(`no user by that name was found - authentication failed`);
            return done(null, false, { message: `authentication failed. please check your email and password.` });
        }

        const comparison = compare(password, user.password);
        logger.debug(`comparison between hashed and plain password result is ${comparison}`);

        return comparison 
            ? done(null, user)
            : done (null, false, { message: "authentication failed. please check your email and password." });
    }));
}
