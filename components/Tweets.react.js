/** @jsx React.DOM */

var React = require('react');
var Tweet = require('./Tweet.react.js');

module.exports = Tweets = React.createClass({
  // render our tweets
  render: function(){
    // build list items of single tweet components using map
    var content = this.props.tweets.map(function(tweet){
      return (
        <Tweet key={tweet._id} tweet={tweet}></Tweet>
      )
    });

    // return ul filled with our mapped tweets
    return (
      <ul className="tweets">{content}</ul>
    )
  }
});
