var argv = require('minimist')(process.argv.slice(2)),
    path = require('path');
var content_dir = argv._[0];
if (!content_dir) {
  console.log("Usage: blue <dir>, where <dir> has your sources (src) and templates (layouts).");
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

function plugin(){
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      console.log(files[file]);
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
	.clean(true)
	.build(function throwErr (err) {
	  if (err) {
	    throw err;
    }
  });
