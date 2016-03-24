var async = require('async');
var templatizer = require('templatizer');
var path = require('path');
var createCLI = require('mongodb-js-cli');
var cli = createCLI('mongodb-compass:scripts:compile-ui');
var LessCache = require('less-cache');
var fs = require('fs');

function generateLessCache(CONFIG, done) {
  var appDir = path.join(__dirname, '..', 'src', 'app');
  var cacheDir = path.join(appDir, '.less-compile-cache');
  var src = path.join(appDir, 'index.less');

  var callback = done;
  if (typeof CONFIG === 'function') {
    callback = CONFIG;
  }

  var lessCache = new LessCache({
    cacheDir: cacheDir,
    resourcePath: appDir,
    importPaths: []
  });

  fs.readFile(src, 'utf-8', function(err, contents) {
    if (err) {
      return done(err);
    }
    lessCache.cssForFile(src, contents);
    callback();
  });
}

function generateTemplates(CONFIG, done) {
  var callback = done;
  if (typeof CONFIG === 'function') {
    callback = CONFIG;
  }
  var appdir = path.join(__dirname, '..', 'src', 'app');
  templatizer(appdir, path.join(appdir, 'templates.js'), callback);
}

module.exports.generateTemplates = generateTemplates;
module.exports.generateLessCache = generateLessCache;

function main() {
  async.series([
    generateTemplates,
    generateLessCache
  ], function(err) {
    cli.abortIfError(err);
    cli.debug('Compiled application UI.');
    process.exit(0);
  });
}

/**
 * ## Main
 */
if (cli.argv.$0 && cli.argv.$0.indexOf('compile-ui.js') > -1) {
  main();
}
