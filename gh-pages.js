var ghpages = require('gh-pages');
var path = require('path');
 
ghpages.publish(path.join(__dirname, 'dist'), function(err){ console.log(err || 'success'); });