# Jasmine Protractor Browser Log Reporter

This is a custom reporter for [Jasmine](https://jasmine.github.io/) that will automatically flush the [Protractor](http://www.protractortest.org/#/) browser console logs in between tests and output those logs to the terminal if the test failed.

## Installation

```bash
npm install --save-dev jasmine-protractor-browser-log-reporter
```

## Use

In your Protractor config file, set Selenium's logging preference to `ALL` and add this project as a custom Jasmine reporter:

```node
const { ProtractorBrowserLogReporter } = require('jasmine-protractor-browser-log-reporter');

exports.config = {
  capabilities: {
    'browserName': 'chrome'
  },
  loggingPrefs: {
    'browser': 'ALL'
  },
  directConnect: true,
  baseUrl: 'http://localhost:8080/',
  framework: 'jasmine',
  onPrepare() {
    jasmine.getEnv().addReporter(new ProtractorBrowserLogReporter());
  }
};
```

## Acknowledgments

The idea for this reporter was taken from [this blog post](http://eitanp461.blogspot.com/2014/01/advanced-protractor-features.html) that describes outputting Protracor browser logs to file using Jasmine 1.3
