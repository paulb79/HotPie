
/**
 * Module dependencies.
 */

require('coffee-script');

var express = require('express')
  , RedisStore = require('connect-redis')(express)
  , http = require('http')
  , url = require('url')
  , path = require('path')
  , flash = require('connect-flash')
  , stylus = require('stylus'); 

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({
    secret: "sdfiernf98h34bru8bdbfufbdfhuewf87g",
    store: new RedisStore
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash());  
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function() {
  app.set('port', 3001);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Global helpers
require('./apps/helpers')(app);

// Routes
require('./apps/authentication/routes')(app);

app.get('/', function(req, res) {
  req.flash('info', 'Hi There');
  res.render('index', { message: req.flash('info') } );
});

app.listen(app.settings.port);
console.log("Express server listening on port %d in %s mode", app.settings.port, app.settings.env);

