var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var texts = require('./texts');
var pwd = require('pwd');
var db = require('./server-app/user-model');


app.set('views', './templates');
app.set('view engine', 'jade');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  if (req.session) {
    next();
  } else {
    res.redirect('/login');
  }
});
app.use(express.static('build'));


function authenticate(name, pass, fn) {
  db.User.findOne({username: name}, function (err, user) {
    if (!user) return fn(new Error('cannot find user'));
    pwd.hash(pass, user.salt, function (err, hash) {
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error('invalid password'));
    })
  })
}

// middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

//router

app.get('/', restrict, function (req, res) {
  res.render('index', {texts: texts, session: session});
});

app.get('/login', function (req, res) {
  res.render('login', {texts: texts, session: session});
});


app.post('/login', function (req, res) {
  authenticate(req.body.userName, req.body.userPassword, function (err, user) {
    if (user) {
      req.session.regenerate(function () {
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      console.log(err);

      pwd.hash(req.body.userPassword, function(err, salt, hash) {
        if (err) {
          console.log(err);
        }

        var user = new db.User({
          username: req.body.userName,
          salt: salt,
          hash: hash
        });

        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("user saved");
            req.session.user = user;
            res.redirect('/');
          }
        });
      });
    }
  });
});


app.get('/texts', function (req, res) {
  res.json(texts);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});