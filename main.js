const cron = require('node-cron');

const config = require('./config.json');
const ddns = require('./ddns.js');

// running a task every 10 minutes
cron.schedule('*/10 * * * *', function(){
  ddns(config);
});