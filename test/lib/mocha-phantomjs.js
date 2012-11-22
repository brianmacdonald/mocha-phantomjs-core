// Generated by CoffeeScript 1.4.0
(function() {

  describe('mocha-phantomjs', function() {
    var expect, fileURL, spawn;
    expect = require('chai').expect;
    spawn = require('child_process').spawn;
    fileURL = function(file) {
      return "file://" + (process.cwd()) + "/test/" + file + ".html";
    };
    before(function() {
      return this.runner = function(done, args, callback) {
        var mochaPhantomJS, stderr, stdout;
        stdout = '';
        stderr = '';
        mochaPhantomJS = spawn("" + (process.cwd()) + "/bin/mocha-phantomjs", args);
        mochaPhantomJS.stdout.on('data', function(data) {
          return stdout = stdout.concat(data.toString());
        });
        mochaPhantomJS.stderr.on('data', function(data) {
          return stderr = stderr.concat(data.toString());
        });
        return mochaPhantomJS.on('exit', function(code) {
          if (typeof callback === "function") {
            callback(code, stdout, stderr);
          }
          return typeof done === "function" ? done() : void 0;
        });
      };
    });
    it('returns a failure code and shows usage when no args are given', function(done) {
      return this.runner(done, [], function(code, stdout, stderr) {
        expect(code).to.equal(1);
        return expect(stdout).to.match(/Usage: mocha-phantomjs/);
      });
    });
    it('returns a failure code and notifies of bad url when given one', function(done) {
      return this.runner(done, ['foo/bar.html'], function(code, stdout, stderr) {
        expect(code).to.equal(1);
        expect(stdout).to.match(/failed to load the page/i);
        expect(stdout).to.match(/check the url/i);
        return expect(stdout).to.match(/foo\/bar.html/i);
      });
    });
    it('returns a failure code and notifies of no such runner class', function(done) {
      return this.runner(done, ['-R', 'nonesuch', fileURL('passing')], function(code, stdout, stderr) {
        expect(code).to.equal(1);
        return expect(stdout).to.equal("Reporter class not implemented: Nonesuch\n");
      });
    });
    it('returns a failure code when mocha can not be found on the page', function(done) {
      return this.runner(done, [fileURL('blank')], function(code, stdout, stderr) {
        expect(code).to.equal(1);
        return expect(stdout).to.equal("Failed to find mocha on the page.\n");
      });
    });
    it('returns a failure code when mocha fails to start for any reason', function(done) {
      return this.runner(done, [fileURL('bad')], function(code, stdout, stderr) {
        expect(code).to.equal(1);
        return expect(stdout).to.equal("Failed to start mocha.\n");
      });
    });
    it('returns failure when mocha is not started in a timely manner', function(done) {
      return this.runner(done, ['-t', 500, fileURL('timeout')], function(code, stdout, stderr) {
        expect(code).to.equal(255);
        return expect(stdout).to.match(/Failed to start mocha: Init timeout/);
      });
    });
    describe('spec', function() {
      var failComplete, failRegExp, passComplete, passRegExp, pendComplete, skipRegExp;
      passRegExp = function(n) {
        return RegExp("\\u001b\\[32m\\s\\s[✔✓]\\u001b\\[0m\\u001b\\[90m\\spasses\\s" + n);
      };
      skipRegExp = function(n) {
        return RegExp("\\u001b\\[36m\\s\\s-\\sskips\\s" + n + "\\u001b\\[0m");
      };
      failRegExp = function(n) {
        return RegExp("\\u001b\\[31m\\s\\s" + n + "\\)\\sfails\\s" + n + "\\u001b\\[0m");
      };
      passComplete = function(n) {
        return RegExp("\\u001b\\[0m\\n\\n\\n\\u001b\\[92m\\s\\s✔\\u001b\\[0m\\u001b\\[32m\\s" + n + "\\stests\\scomplete");
      };
      pendComplete = function(n) {
        return RegExp("\\u001b\\[36m\\s+•\\u001b\\[0m\\u001b\\[36m\\s" + n + "\\stests\\spending");
      };
      failComplete = function(x, y) {
        return RegExp("\\u001b\\[91m\\s\\s✖\\u001b\\[0m\\u001b\\[31m\\s" + x + "\\sof\\s" + y + "\\stests\\sfailed");
      };
      describe('passing', function() {
        /*
              $ ./bin/mocha-phantomjs -R spec test/passing.html
              $ mocha -r chai/chai.js -R spec --globals chai.expect test/lib/passing.js
        */
        before(function() {
          return this.args = [fileURL('passing')];
        });
        it('returns a passing code', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            return expect(code).to.equal(0);
          });
        });
        return it('writes all output in color', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            expect(stdout).to.match(/Tests Passing/);
            expect(stdout).to.match(passRegExp(1));
            expect(stdout).to.match(passRegExp(2));
            expect(stdout).to.match(passRegExp(3));
            expect(stdout).to.match(skipRegExp(1));
            expect(stdout).to.match(skipRegExp(2));
            expect(stdout).to.match(skipRegExp(3));
            expect(stdout).to.match(passComplete(6));
            return expect(stdout).to.match(pendComplete(3));
          });
        });
      });
      describe('failing', function() {
        /*
              $ ./bin/mocha-phantomjs test/failing.html
              $ mocha -r chai/chai.js -R spec --globals chai.expect test/lib/failing.js
        */
        before(function() {
          return this.args = [fileURL('failing')];
        });
        it('returns a failing code equal to the number of mocha failures', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            return expect(code).to.equal(3);
          });
        });
        return it('writes all output in color', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            expect(stdout).to.match(/Tests Failing/);
            expect(stdout).to.match(passRegExp(1));
            expect(stdout).to.match(passRegExp(2));
            expect(stdout).to.match(passRegExp(3));
            expect(stdout).to.match(failRegExp(1));
            expect(stdout).to.match(failRegExp(2));
            expect(stdout).to.match(failRegExp(3));
            return expect(stdout).to.match(failComplete(3, 6));
          });
        });
      });
      return describe('requirejs', function() {
        before(function() {
          return this.args = [fileURL('requirejs')];
        });
        it('returns a passing code', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            return expect(code).to.equal(0);
          });
        });
        return it('writes all output in color', function(done) {
          return this.runner(done, this.args, function(code, stdout, stderr) {
            expect(stdout).to.match(/Tests Passing/);
            expect(stdout).to.match(passRegExp(1));
            expect(stdout).to.match(passRegExp(2));
            expect(stdout).to.match(passRegExp(3));
            expect(stdout).to.match(skipRegExp(1));
            expect(stdout).to.match(skipRegExp(2));
            expect(stdout).to.match(skipRegExp(3));
            expect(stdout).to.match(passComplete(6));
            return expect(stdout).to.match(pendComplete(3));
          });
        });
      });
    });
    describe('dot', function() {
      /*
          $ ./bin/mocha-phantomjs test/mixed.html dot
          $ mocha -r chai/chai.js -R dot --globals chai.expect test/lib/mixed.js
      */
      before(function() {
        return this.args = ['-R', 'dot', fileURL('mixed')];
      });
      it('uses dot reporter', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          expect(stdout).to.match(/\u001b\[90m\․\u001b\[0m/);
          expect(stdout).to.match(/\u001b\[36m\․\u001b\[0m/);
          return expect(stdout).to.match(/\u001b\[31m\․\u001b\[0m/);
        });
      });
      /*
          $ ./bin/mocha-phantomjs test/many.html dot
          $ mocha -r chai/chai.js -R dot --globals chai.expect test/lib/many.js
      */

      before(function() {
        return this.args = ['-R', 'dot', fileURL('many')];
      });
      return it('wraps lines correctly and has only one double space for the last dot', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          var matches;
          matches = stdout.match(/\d\dm\․\u001b\[0m\n\n/g);
          return expect(matches.length).to.equal(1);
        });
      });
    });
    describe('tap', function() {
      /*
          $ ./bin/mocha-phantomjs -R tap test/mixed.html
          $ mocha -r chai/chai.js -R tap --globals chai.expect test/lib/mixed.js
      */
      before(function() {
        return this.args = ['-R', 'tap', fileURL('mixed')];
      });
      return it('basically works', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          return expect(stdout).to.match(/Tests Mixed/);
        });
      });
    });
    describe('list', function() {
      /*
          $ ./bin/mocha-phantomjs -R list test/mixed.html
          $ mocha -r chai/chai.js -R list --globals chai.expect test/lib/mixed.js
      */
      before(function() {
        return this.args = ['-R', 'list', fileURL('mixed')];
      });
      return it('basically works', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          return expect(stdout).to.match(/Tests Mixed/);
        });
      });
    });
    describe('doc', function() {
      /*
          $ ./bin/mocha-phantomjs -R doc test/mixed.html
          $ mocha -r chai/chai.js -R doc --globals chai.expect test/lib/mixed.js
      */
      before(function() {
        return this.args = ['-R', 'doc', fileURL('mixed')];
      });
      return it('basically works', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          return expect(stdout).to.match(/<h1>Tests Mixed<\/h1>/);
        });
      });
    });
    describe('xunit', function() {
      /*
          $ ./bin/mocha-phantomjs -R xunit test/mixed.html
          $ mocha -r chai/chai.js -R xunit --globals chai.expect test/lib/mixed.js
      */
      before(function() {
        return this.args = ['-R', 'xunit', fileURL('mixed')];
      });
      return it('basically works', function(done) {
        return this.runner(done, this.args, function(code, stdout, stderr) {
          return expect(stdout).to.match(/<testcase classname="Tests Mixed" name="passes 1" time=".*"\/>/);
        });
      });
    });
    return describe('config', function() {
      describe('user-agent', function() {
        /*
              $ ./bin/mocha-phantomjs -R spec test/user-agent.html
        */
        it('it has the default user agent', function(done) {
          return this.runner(done, [fileURL('user-agent')], function(code, stdout, stderr) {
            return expect(stdout).to.match(/PhantomJS\//);
          });
        });
        it('it has a custom user agent', function(done) {
          return this.runner(done, ['-A', 'cakeUserAgent', fileURL('user-agent')], function(code, stdout, stderr) {
            return expect(stdout).to.match(/^cakeUserAgent\n/);
          });
        });
        return it('it has a custom user agent via setting flag', function(done) {
          return this.runner(done, ['-s', 'userAgent=cakeUserAgent', fileURL('user-agent')], function(code, stdout, stderr) {
            return expect(stdout).to.match(/^cakeUserAgent\n/);
          });
        });
      });
      describe('cookies', function() {
        /*
              $ ./bin/mocha-phantomjs -R spec test/cookie.html
        */
        return it('it has passed cookies', function(done) {
          return this.runner(done, ['-c', 'foo=bar', '--cookie', 'baz=bat', fileURL('cookie')], function(code, stdout, stderr) {
            return expect(stdout).to.match(/foo=bar; baz=bat/);
          });
        });
      });
      return describe('viewport', function() {
        /*
              $ ./bin/mocha-phantomjs -R spec test/viewport.html
        */
        return it('it has passed cookies', function(done) {
          return this.runner(done, ['-v', '123x456', fileURL('viewport')], function(code, stdout, stderr) {
            return expect(stdout).to.match(/123x456/);
          });
        });
      });
    });
  });

}).call(this);
