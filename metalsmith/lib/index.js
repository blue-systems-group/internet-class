var argv = require('minimist')(process.argv.slice(2)),
    path = require('path');
var content_dir = argv._[0],
    mongo_url = argv._[1];

if (!content_dir || !mongo_url) {
  console.log("Usage: <content> <mongo_url>");
  return;
}
content_dir = path.join(process.cwd(), content_dir);

var metalsmith = require('metalsmith'),
    asciidoc = require('metalsmith-asciidoc'),
    copy = require('metalsmith-copy'),
    filemetadata = require('metalsmith-filemetadata'),
    layouts = require('metalsmith-layouts'),
    formatcheck = require('metalsmith-formatcheck'),
    ignore = require('metalsmith-ignore'),
    clean = require('metalsmith-clean');

var mongo = require('mongodb').MongoClient,
    assert = require('assert');

function updatemongo() {
  return function(files, metalsmith, done){
    mongo.connect(mongo_url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      db.close();
      done();
    });
  };
}

metalsmith(process.cwd())
  .source(content_dir)
	.use(asciidoc())
  .use(copy({
    pattern: '**/*.html',
    extension: '.db'
  }))
  .use(filemetadata([
    {pattern: '**/*.html', metadata: {'layout': 'dummy.hbt'}}
  ]))
  .use(layouts({
    engine: 'handlebars',
    directory: path.join(__dirname, '../layouts')
  }))
  .use(formatcheck({ verbose: true , failWithoutNetwork: false }))
  .use(ignore('**/*.html'))
  .use(updatemongo())
	.clean(true)
	.build(function throwErr (err) {
	  if (err) {
	    throw err;
    }
  });
