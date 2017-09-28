let Reporter = require('./reporter.js');

describe('Protractor Browser Log Reporter', () => {

  let logs, reporter = null;

  global.browser = {
    driver: {
      manage: () => {
        return manager;
      }
    },
    wait: () => {}
  }

  let manager = {
    logs: () => {
      return logs;
    }
  }

  beforeEach(() => {
    logs = jasmine.createSpyObj('logs', ['get']);
    spyOn(console, 'log');
    reporter = new Reporter();
  });

  describe('flushLogs', () => {

    describe('when browser logs can not be found', () => {

      beforeEach(() => {
        logs.get.and.returnValue(Promise.reject('Logs not found'));
      });

      it('does not log anything if the test passed', (done) => {
        reporter.flushLogs({status: 'passed'}).then(() => {
          expect(console.log).not.toHaveBeenCalled();
          done();
        });
      });

      it('logs error messages if the test failed', (done) => {
        reporter.flushLogs({
          status: 'failed',
          fullName: 'My awesome test'
        }).then(() => {
          expect(console.log).toHaveBeenCalledWith('\nError outputting browser logs for test:', 'My awesome test');
          expect(console.log).toHaveBeenCalledWith('Logs not found');
          expect(console.log).toHaveBeenCalledWith('');
          done();
        });
      });

    });

    describe('when browser logs can be found', () => {

      describe('but there are no log entries', () => {

        beforeEach(() => {
          logs.get.and.returnValue(Promise.resolve([]));
        });

        it('does not log anything if the test passed', (done) => {
          reporter.flushLogs({status: 'passed'}).then(() => {
            expect(console.log).not.toHaveBeenCalled();
            done();
          });
        });

        it('logs a message if the test failed', (done) => {
          reporter.flushLogs({
            status: 'failed',
            fullName: 'My awesome test'
          }).then(() => {
            expect(console.log).toHaveBeenCalledWith('\nNo browser logs were generated for test:', 'My awesome test');
            expect(console.log).toHaveBeenCalledWith('');
            done();
          });
        });

      });

      describe('and there is one log entry', () => {

        beforeEach(() => {
          let logEntries = [{
            timestamp: 500000000,
            type: 'bad',
            message: 'i am a message'
          }]
          logs.get.and.returnValue(Promise.resolve(logEntries));
        });

        it('does not log anything if the test passed', (done) => {
          reporter.flushLogs({status: 'passed'}).then(() => {
            expect(console.log).not.toHaveBeenCalled();
            done();
          });
        });

        it('logs a message if the test failed', (done) => {
          reporter.flushLogs({
            status: 'failed',
            fullName: 'My awesome test'
          }).then(() => {
            expect(console.log).toHaveBeenCalledWith('\nBrowser logs for test:', 'My awesome test');
            expect(console.log).toHaveBeenCalledWith('11:53:20', 'bad', 'i am a message');
            expect(console.log).toHaveBeenCalledWith('');
            done();
          });
        });

      });

      describe('and there are multiple log entries', () => {

        beforeEach(() => {
          let logEntries = [{
            timestamp: 500000000,
            type: 'bad',
            message: 'i am a message'
          }, {
            timestamp: 500001000,
            type: 'less bad',
            message: 'i am another message'
          }]
          logs.get.and.returnValue(Promise.resolve(logEntries));
        });

        it('does not log anything if the test passed', (done) => {
          reporter.flushLogs({status: 'passed'}).then(() => {
            expect(console.log).not.toHaveBeenCalled();
            done();
          });
        });

        it('logs a message if the test failed', (done) => {
          reporter.flushLogs({
            status: 'failed',
            fullName: 'My awesome test'
          }).then(() => {
            expect(console.log).toHaveBeenCalledWith('\nBrowser logs for test:', 'My awesome test');
            expect(console.log).toHaveBeenCalledWith('11:53:20', 'bad', 'i am a message');
            expect(console.log).toHaveBeenCalledWith('11:53:21', 'less bad', 'i am another message');
            expect(console.log).toHaveBeenCalledWith('');
            done();
          });
        });

      });

      it('pads digits in the timestamp', (done) => {
        let logEntries = [{
          timestamp: 61000,
          type: 'bad',
          message: 'i am a message'
        }]
        logs.get.and.returnValue(Promise.resolve(logEntries));
        reporter.flushLogs({
          status: 'failed',
          fullName: 'My awesome test'
        }).then(() => {
          expect(console.log).toHaveBeenCalledWith('\nBrowser logs for test:', 'My awesome test');
          expect(console.log).toHaveBeenCalledWith('5:01:01', 'bad', 'i am a message');
          expect(console.log).toHaveBeenCalledWith('');
          done();
        });
      });

    });

  });

});
