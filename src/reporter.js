module.exports = function ProtractorBrowserLogReporter() {

  let moment = require('moment');

  this.jasmineStarted = function(suiteInfo) { }

  this.suiteStarted = function(result) { }

  this.specStarted = function(result) { }

  this.specDone = function(result) {
    // Pause execution while logs are flushed
    browser.wait(this.flushLogs(result), 30000);
  }

  this.suiteDone = function(result) { }

  this.jasmineDone = function() { }

  this.flushLogs = function(result) {
    // Flush browser logs between tests. Ref: https://stackoverflow.com/questions/30582297/clear-console-log-in-browser-using-protractor
    return browser.driver.manage().logs().get('browser').then((logsEntries) => {
      if (logsEntries.length > 0) {
        console.log('\nBrowser logs for test:', result.fullName);
        logsEntries.forEach((logEntry) => {
          let timestamp = moment(logEntry.timestamp).format('h:mm:ss');
          console.log(timestamp, logEntry.type, logEntry.message);
        });
        console.log('');
      }
    }).catch((err) => {
      if(result.status === 'failed') {
        console.log('\nError outputting browser logs for test:', result.fullName);
        console.log(err);
        console.log('');
      }
    });
  }

};
