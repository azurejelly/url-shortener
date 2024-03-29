import { NextFunction, Response, Request } from "express";
import logger from "../lib/logger";

const titles = {
    500: "internal server error",
    404: "not found",
};

const descriptions = {
    500: "an internal error has occurred and the server is unable to handle this request.",
    404: "the requested resource was not found in this server.",
};

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`an internal error has occurred: ${err.stack}`);
    res.status(500);

    if (req.accepts('html')) {
        res.render('error', { title: titles[500], description: descriptions[500] });
        return;
    }

    if (req.accepts('json')) {
        res.json({ status: 500, message: descriptions[500] });
        return;
    }

    res.send(descriptions[500]);
};

const notFoundHandler = (req: Request, res: Response, _: NextFunction) => {
    res.status(404);

    if (req.accepts('html')) {
        res.render('error', { title: titles[404], description: descriptions[404] });
        return;
    }

    if (req.accepts('json')) {
        res.json({ status: 404, message: descriptions[404] });
        return;
    }

    res.send(descriptions[404]);
}

export { notFoundHandler, errorHandler }