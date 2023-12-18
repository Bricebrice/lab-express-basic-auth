const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

module.exports = (app) => {
  // required for the app when deployed to Heroku (in production)
  app.set("trust proxy", 1);
  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, //--> 1day
      },
      store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/lab-express-basic-auth",
      }),
    })
  );
};
