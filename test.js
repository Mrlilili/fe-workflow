var minimist = require('minimist');



var options = minimist(process.argv.slice(2));

console.log(options['_'][0]);