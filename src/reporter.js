module.exports = function ProtractorBrowserLogReporter() {

  let moment = require('moment');

  this.flushingLogs = false;

  this.jasmineStarted = function(suiteInfo) { }

  this.suiteStarted = function(result) { }

  this.specStarted = function(result) { }

  this.specDone = function(result) {
    this.flushingLogs = true;

    // Flush browser logs between tests. Ref: https://stackoverflow.com/questions/30582297/clear-console-log-in-browser-using-protractor
    browser.driver.manage().logs().get('browser').then((logsEntries) => {
      // Output logs to console on failure. Ref: http://eitanp461.blogspot.com/2014/01/advanced-protractor-features.html
      if(result.status === 'failed') {
        console.log('\nBrowser logs for test "' + result.fullName + '" :');
        logsEntries.forEach((logEntry) => {
          let timestamp = moment(logEntry.timestamp).format('h:mm:ss');
          console.log(timestamp, logEntry.type, logEntry.message);
        });
        console.log('');
      }
      this.flushingLogs = false;
    }).catch((err) => {
      if(result.status === 'failed') {
        console.log('\nError outputting browser logs for test "' + result.fullName + '" :');
        console.log(err + '\n');
      }
      this.flushingLogs = false;
    });

    // Pause execution while logs are flushed
    browser.wait(() => {
      return !this.flushingLogs;
    }, 30000);
  }

  this.suiteDone = function(result) { }

  this.jasmineDone = function() { }

};
