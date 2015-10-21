var metalsmith = require('metalsmith'),
	asciidoc = require('metalsmith-asciidoc'),
	clean = require('metalsmith-clean')
	markdown = require('metalsmith-markdown');

function plugin(){
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      console.log(files[file]);
	});
  };
}
metalsmith(__dirname)
	.use(asciidoc())
	.use(markdown())
	.use(plugin())
	.clean(true)
	.build(function throwErr (err) {
	  if (err) {
	    throw err;
      }
    });
