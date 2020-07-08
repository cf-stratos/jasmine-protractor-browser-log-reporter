const chalk = require('chalk');

module.exports = function ProtractorBrowserLogReporter() {

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
        console.log('\nBrowser logs for test: ', chalk.bgCyan(' ' + result.fullName + ' '));
        logsEntries.forEach((logEntry) => {
          let msg;
          const level = `${logEntry.level}`;
          switch(level) {
            case 'SEVERE':
              msg = chalk.red(logEntry.message);
              break;
            case 'WARNING':
              msg = chalk.yellow(logEntry.message);
              break;
            default:
              msg = chalk.cyan(logEntry.message);
              break;
            }
            console.log(msg);
          }
        );
        console.log('');
      }
    }).catch((err) => {s
      if(result.status === 'failed') {
        console.log('\nError outputting browser logs for test:', result.fullName);
        console.log(err);
        console.log('');
      }
    });
  }

};
