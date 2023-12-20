const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) { // means that user is not logged in
    return res.redirect("/login");
  }
  next(); // if user is logged in, call the next function
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) { // means that user is already logged in
    return res.redirect("/");
  }
  next();
};

module.exports = { // export as objects
  isLoggedIn,
  isLoggedOut,
};
