/** @jsx React.DOM */

var React = require('react');
var Tweets = require('./Tweets.react.js');
var Loader = require('./Loader.react.js');
var NotificationBar = require('./NotificationBar.react.js');

module.exports = TweetsApp = React.createClass({
  // method to add tweet to our timeline
  addTweet: function(tweet){
    // get application state
    var updated = this.state.tweets;

    // increment the unread count
    var count = this.state.count + 1;

    // increment the skip count
    var skip = this.state.skip + 1;

    // add tweet to the beginning of tweet array
    updated.unshift(tweet);

    // set the application state
    this.setState({tweets: updated, count: count, skip: skip});
  },

  // method to get JSON from server by page
  getPage: function(page){
    // setup our AJAX request
    var request = new XMLHttpRequest(), self = this;
    request.open('GET', 'page/' + page + '/' + this.state.skip, true);
    request.onLoad = function(){
      // if everything is cool, load the next page
      if(request.status >= 200 && request.status < 400){
        self.loadPagedTweets(JSON.parse(request.responseText));
      } else {
        // set application state - not paging, paging complete
        self.setState({paging: false, done: true});
      }
    };

    // fire off the request
    request.send();
  },

  // method to show the unread tweets
  showNewTweets: function(){
    // get current application state
    var updated = this.state.tweets;

    // mark our tweets active
    updated.forEach(function(tweet){
      tweet.active = true;
    });

    // set the application state
    this.setState({tweets: updated, count: 0});
  },

  // method to load tweets saved from the server
  loadPagedTweets: function(tweets){
    // so meta
    var self = this;

    // if we still have tweets
    if(tweets.length > 0){
      // get current application state
      var updated = this.state.tweets

      // push them onto the end of the current array
      tweets.forEach(function(tweet){
        updated.push(tweet);
      });

      // This app is so fast, I actually use a timeout for dramatic effect
      // Otherwise you'd never see our super sexy loader svg
      setTimeout(function(){

        // Set application state (Not paging, add tweets)
        self.setState({tweets: updated, paging: false});

      }, 1000);
    } else {
      this.setState({done: true, paging: false});
    }
  },

  // method to check if more tweets should be loaded
  checkWindowScroll: function(){
    // get scroll position and window data
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = (document.body.scrollTop, document.documentElement.scrollTop || 0);
    var scrolled = (h + s) > document.body.offsetHeight;

    // if scrolled enough, not paging, not complete
    if(scrolled && !this.state.paging && !this.state.done){
      // set application state (paging, increment page count)
      this.setState({paging: true, page: this.state.page + 1});

      // get the next page of tweets from the server
      this.getPage(this.state.page);
    }
  },

  // get initial component state
  getInitialState: function(props){
    props = props || this.props;

    // set initial state using props
    return {
      tweets: props.tweets,
      count: 0,
      page: 0,
      paging: false,
      skip: 0,
      done: false
    }
  },

  componentWillReceiveProps: function(){
    // preserve self reference
    var self = this;

    // initialize socket.io
    var socket = io.connect();

    // on tweet emission...
    socket.on('tweet', function(data){
      // add tweet to queue
      self.addTweet(data);
    });

    // add scroll listener to window for inifinite paging
    window.addEventListener('scroll', this.checkWindowScroll);

  },

  // render the component
  render: function(){
    return (
      <div className="tweets-app">
        <Tweets tweets={this.state.tweets}></Tweets>
        <Loader paging={this.state.paging}></Loader>
        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets}></NotificationBar>
      </div>
    )
  }
});
