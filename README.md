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