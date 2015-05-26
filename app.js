var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');
var texts = require('./texts');
var pwd = require('pwd');
var dbConfig = require('./db-config.json');
var db = require('./server-app/user-model')(dbConfig.prod);


app.set('views', './templates');
app.set('view engine', 'jade');

app.set('port', (process.env.PORT || 3000));

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

app.use(process.env.LOCAL_ENV === 'production' ? express.static('dist') : express.static('build'));


function authenticate(firstName, lastName, groupName, pass, fn) {
  db.User.findOne({firstName: firstName, lastName: lastName, groupName: groupName}, function (err, user) {
    if (!user) return fn(new Error(texts.commonErrors.thereIsNoSuchUser));
    pwd.hash(pass, user.salt, function (err, hash) {
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error(texts.commonErrors.invalidPassword));
    })
  })
}

// middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = texts.commonErrors.accessDenied;
    res.redirect('/login');
  }
}

function adminRestrict (req, res, next) {
  if (req.session.user.admin) {
    next();
  } else {
    req.session.error = texts.commonErrors.accessDenied;
    res.redirect('/login');
  }
}

//router

app.get('/', function (req, res) {
    res.render('index', {texts: texts, session: req.session, prod: process.env.LOCAL_ENV === 'production'});
});

app.get('/login', function (req, res) {
  res.render('login', {texts: texts, session: req.session});
});

app.get('/finished', function (req, res) {
  res.render('finish', {texts: texts, session: req.session});
});


app.get('/admin', restrict, adminRestrict, function (req, res) {
  db.User.find().distinct('groupName', function (err, groups) {
    var filteredGroups = _.filter(groups, function (group) {
      return group && group !== 'admin';
    });
    res.render('admin', {texts: texts, session: req.session, groups: filteredGroups});
  });
});

app.get('/admin/group/:groupName', restrict, adminRestrict, function (req, res) {
  db.User.find({groupName: req.params.groupName}, function (err, users) {
    var filteredUsers = _.filter(users, function (user) {
      return user.firstName && user.firstName !== 'admin';
    });
    res.render('group', {texts: texts, session: req.session, users: filteredUsers, groupName: req.params.groupName});
  });
});

app.post('/admin/group/:groupName/delete', restrict, adminRestrict, function (req, res) {
  db.User.remove({groupName: req.params.groupName}, function (err, users) {
    res.redirect('/admin');
  });
});

app.post('/admin/user/delete', restrict, adminRestrict, function (req, res) {
  db.User.find({firstName: req.body.firstName, hash: req.body.hash}).remove(function (err, users) {
    res.redirect('/admin/group/' + req.body.groupName);
  });
});


app.post('/login', function (req, res) {
  authenticate(req.body.firstName, req.body.lastName, req.body.groupName, req.body.userPassword, function (err, user) {
    if (user) {
      req.session.regenerate(function () {
        req.session.user = user;
        if (user.admin) {
          res.redirect('/admin');
        } else {
          res.redirect('/');
        }
      });
    } else {
      console.log(err);

      pwd.hash(req.body.userPassword, function(err, salt, hash) {
        if (err) {
          console.log(err);
        }

        var user = new db.User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          groupName: req.body.groupName,
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

app.post('/finished', function (req, res) {
  var session = req.session;
  db.User.findOne({firstName: session.user.firstName, lastName: session.user.lastName, groupName: session.user.groupName}, function (err, user) {
    user.done = true;
    user.save(function (err) {

      if (err) {
        console.log(err);
      } else {
        req.session.destroy(function (err) {
          res.redirect('/finished');
        });
      }

    })
  });
});


app.get('/texts', function (req, res) {
  res.json(texts);
});


var server = app.listen(app.get('port'), function () {


  console.log('Example app listening at %s', app.get('port'));

});