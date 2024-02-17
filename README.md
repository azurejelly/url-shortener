# url-shortener
an open source express.js url shortener written in typescript. with an admin panel, hopefully.

## setting up
first, clone the repository using git:
```sh
git clone https://github.com/nekoture/url-shortener && cd url-shortener
```
then, install dependencies:
```sh
npm install
```

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

#### resetting database
you can also reset the local development database using:
```sh
npm run reset-db
```

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