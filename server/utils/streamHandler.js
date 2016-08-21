var Tweet = require('./models/Tweet');

module.exports = function(stream, io){
  // when tweets get sent our way
  stream.on('data', function(data){
    if(data['user'] !== undefined){
      // construct a new tweets object
      var tweet = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_image_url'],
        body: data['text'],
        date: data['created-at'],
        screenname: data['user']['screen_name']
      };

      var tweetEntry = new Tweet(tweet);

      // save 'er to the database
      tweetEntry.save(function(err){
        if(!err){
          // if everything is cool socket.io emits the tweet
          io.emit('tweet', tweet);
        }
      });
    }
  });
};
