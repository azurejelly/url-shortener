import morgan from "morgan";
import logger from "../lib/logger";
import { isDevelopment } from "../utils/environment";

const skip = () => isDevelopment;
const stream = {
    write: (message: string) => logger.http(message.substring(0, message.lastIndexOf('\n')))
}

const middleware = morgan('tiny', { stream, skip });
export default middleware;