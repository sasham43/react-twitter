var JSX = require('node-jsx').install(),
  React = require('react'),
  ReactDOM = require('react-dom/server'),
  TweetsApp = React.createFactory(require('./components/TweetsApp.react.js')),
  Tweet = require('./models/Tweet.js');

  module.exports = {
    index: function(req, res){
      // call static model to get tweets to the db
      Tweet.getTweets(0,0, function(tweets, pages){

        // render react to a string, passing in the returned tweets
        var markup = ReactDOM.renderToString(
          TweetsApp({
            tweets:tweets
          })
        );


        res.render('home', {
          markup: markup, // pass rendered react markup
          state: JSON.stringify(tweets) // pass current state to client side
        });

      });
    },
    page: function(req, res){
      Tweet.getTweets(req.params.page, req.params.skip, function(tweets){
        res.send(tweets); // render as JSON
      })
    }
  }
