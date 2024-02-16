import morgan from "morgan";
import logger from "../lib/logger";

const stream = {
    write: (message: string) => logger.http(message.substring(0, message.lastIndexOf('\n')))
}

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const middleware = morgan('tiny', { stream, skip });
export default middleware;