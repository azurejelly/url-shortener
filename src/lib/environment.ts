import prisma from "./prisma";
import { encrypt } from "./password";
import logger from "./logger";
import { generateRandomString } from "./random";
import isEmail from "validator/lib/isEmail";
import { isStrongPassword } from "validator";

const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";

const setupSampleUser = async () => {
    if (!isDevelopment) {
        return;
    }

    const sampleUser = {
        name: "Aira",
        email: "aira@example.com",
        password: encrypt("password"),
        key: generateRandomString(32)
    };

    await prisma.user.delete({ where: { email: "aira@example.com" } })
        .catch((_) => logger.warn(`failed to delete sample user, this is safe to ignore if the database was recently reset.`));

    await prisma.user.create({ data: sampleUser })
        .then(() => logger.info(`generated random user with info: ${JSON.stringify(sampleUser)}`));
};

const setupDefaultUser = () => {
    const defaultEmail = process.env.DEFAULT_ACCOUNT_EMAIL;
    const defaultName = process.env.DEFAULT_ACCOUNT_NAME;
    const defaultPassword = process.env.DEFAULT_ACCOUNT_PASSWORD;

    prisma.user.count()
        .catch((err) => logger.warn(`failed to check user count: ${err.stack}`))
        .then((count) => {
            if (count == 0) {
                logger.warn(`there are no available dashboard accounts!`);
                if (!defaultEmail || !defaultName || !defaultPassword) {
                    logger.warn(`in order to create a new one, please set the required environment variables respectively.`);
                    logger.warn(`for more info, read https://github.com/nekoture/url-shortener`);
                    return;
                }

                if (!isEmail(defaultEmail)) {
                    logger.warn(`in order to create a new one, please set a valid email under the DEFAULT_ACCOUNT_EMAIL environment variable.`);
                    logger.warn(`for more info, read https://github.com/nekoture/url-shortener`);
                    return;
                }

                if (!isStrongPassword(defaultPassword)) {
                    logger.warn(`the default account password is not very strong. consider changing it under the account management page.`);
                    logger.warn(`for more info, read https://github.com/nekoture/url-shortener`);
                }

                const data = {
                    email: defaultEmail,
                    name: defaultEmail,
                    password: encrypt(defaultPassword),
                    key: generateRandomString(32),
                };

                prisma.user.create({ data })
                    .catch((err) => logger.error(`something went wrong while creating the default account: ${err.stack}`))
                    .then(() => {
                        logger.info(`🚀 default account created! you can now:`);
                        logger.info(`- remove the account details from your environment variables.`);
                        logger.info(`- access the admin dashboard @ http://127.0.0.1:3000/admin`)
                    });
            } else {
                if (defaultEmail || defaultName || defaultPassword) {
                    logger.warn(`there are default account details in your environment variables!`);
                    logger.warn(`you can safely remove them as you already have one or more accounts created.`);
                }
            }
        });
}
const createDummyUsers = async (amount: number) => {
    if (!isDevelopment) {
        return;
    }

    if (!process.env.CREATE_DUMMY_USERS) {
        return;
    }

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

export { isDevelopment, setupSampleUser, createDummyUsers, setupDefaultUser };