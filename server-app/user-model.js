var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/correlation");
var userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String
});
module.exports.User = mongoose.model("user", userSchema);