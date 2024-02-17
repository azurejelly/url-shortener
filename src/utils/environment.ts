import prisma from "../lib/prisma";
import { encrypt } from "../lib/password";
import logger from "../lib/logger";
import { generateRandomString } from "./random";

const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";

const setupSampleUser = async () => {
    const sampleUser = {
        name: "Nekoture",
        email: "me@nekoture.xyz",
        password: encrypt("password"),
        key: generateRandomString(32)
    };

    await prisma.user.delete({ where: { email: "me@nekoture.xyz" } })
        .catch((_) => logger.warn(`Failed to delete sample user!`));

    await prisma.user.create({ data: sampleUser })
        .then(() => {
            logger.info(`generated random user with info: ${JSON.stringify(sampleUser)}`);
        });
};

const createDummyUsers = async (amount: number) => {
    for (let i = 0; i < amount; i++) {
        const sampleUser = {
            name: "Dummy User",
            email: generateRandomString(8) + "@example.com",
            password: encrypt(generateRandomString(8)),
            key: generateRandomString(32)
        };
    
        await prisma.user.create({ data: sampleUser })
            .then(() => {
                logger.info(`generated random user with info: ${JSON.stringify(sampleUser)}`);
            });
    }
}

export { isDevelopment, setupSampleUser, createDummyUsers };