var mongoose = require('mongoose');

module.exports = function (dbConfig) {
  var host;
  if (dbConfig.user && dbConfig.password) {
    host = dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.host;
  } else {
    host = dbConfig.host;
  }
  mongoose.connect(host);
  var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    admin: Boolean,
    done: Boolean,
    salt: String,
    hash: String
  });

  return {
    User: mongoose.model("user", userSchema)
  };
};