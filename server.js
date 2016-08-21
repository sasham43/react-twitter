var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  twitter = require('ntwitter'),
  path = require('path'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

var app = express();
var port = process.env.PORT || 3000;


app.use(express.static('public'));

// set up handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// app.set('views', '/Users/sashakramer/workspace/react-twitter/server/views');

// disable etags on responses
app.disable('etag');

// connect to db
mongoose.connect('mongodb://localhost/react-tweets');

// create new twitter instance
var twit = new twitter(config.twitter);

// index route
app.get('/', routes.index);

// page routes
app.get('page/:page/:skip', routes.page);

// app.use(express.static(path.join(__dirname + "public")));

// start up server
var server = http.createServer(app).listen(port, function(){
  console.log('Twitter server listening on port ' + port);
});
