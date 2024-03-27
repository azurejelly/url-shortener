# url-shortener
an open source express.js url shortener written in typescript. maybe with a better-looking dashboard someday.

## setting up
first, clone the repository using git:
```sh
git clone https://github.com/nekoture/url-shortener && cd url-shortener
```
then, install dependencies:
```sh
npm install
```

### environment variables
now, rename (or copy) `.env.example` to `.env`:
```sh
cp .env.example .env # to copy
mv .env.example .env # to rename
```

inside of it you should see the following:
```properties
PORT=3000
LOG_LEVEL=info
DATABASE_URL="file:./dev.db"
DEFAULT_REDIRECT=https://www.google.com
SESSION_SECRET=

DEFAULT_ACCOUNT_EMAIL=
DEFAULT_ACCOUNT_NAME=
DEFAULT_ACCOUNT_PASSWORD=
```

the things you should change are:
- `PORT`: the port the server should listen for connections on
- `LOG_LEVEL`: the logging level, i suggest using `warn` once you're done setting up everything
- `DATABASE_URL`: by default the server will use sqlite, but you can change to a supported database like postgresql or mysql. read more about it [here](https://www.prisma.io/docs/orm/reference/connection-urls).
- `SESSION_SECRET`: required by [express-session](https://github.com/expressjs/session#secret). (tl;dr: generate a strong password)
- `DEFAULT_REDIRECT`: where should the server redirect to when a shortened url is invalid?

to setup a default account, set the following:
- `DEFAULT_ACCOUNT_EMAIL`: the account email, used for logging in. (e.g. `aira@example.com`). if invalid, the server will not create a default account.
- `DEFAULT_ACCOUNT_NAME`: the account username, used for identification purposes only. (e.g. `Aira`)
- `DEFAULT_ACCOUNT_PASSWORD`: the account password. the server will warn you if you enter a not-so-strong password, but it will still create the account anyway. nevertheless, you should change it after you're done setting the account up.

once the default account has been created, you can safely remove the environment variables related to it.

## running the app
as of right now, you have two ways of running the app:

### nodemon (for development)
in the root project directory, run the following command to generate and apply prisma migrations:
```sh
npm run sync-dev
```
then, run the project using:
```sh
npm test
```
please note that when using nodemon, changing a source file will restart the app.

### building (for production)
in the root project directory, run:
```sh
npm run deploy
```
this will apply required prisma migrations. you can now build the project using:
```sh
npm run build
```
a directory called `dist/` will be created containing all compiled code. run the thing using:
```sh
npm run start
```

## usage
once the server is running, open up a browser and go to http://127.0.0.1:3000/. enter your account credentials, and you should be at the dashboard. don't expect too much from it, i don't like doing front-end at all and this is in fact my first ever try at using passport and similar libraries (if you know how to do some of this stuff in a better way, feel free to make a contribution).

everything from here should be pretty straight-forward. there's an account management page, a button to logout, a table with all the shortened urls and you can also use the api to create shortened urls. there are 2 curl examples in the dashboard that are generated directly with your api key.

be careful with streaming to twitch or other apps/sites as sensitive information might be displayed depending on what you visit.

## troubleshooting
h-have you tried restarting the device?

### session expires immediately after logging in
this is very likely due to the server not running on HTTPS while on a production environment. the fix is to either setup HTTPS or set the `DISABLE_SECURE_COOKIE` environment variable as a workaround (please do the first one instead, we're on 2024).
