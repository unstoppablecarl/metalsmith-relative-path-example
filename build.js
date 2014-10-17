'use strict';

var path        = require('path');

var Handlebars  = require('handlebars');
var metalsmith  = require('metalsmith');

var markDown    = require('metalsmith-markdown');
var templates   = require('metalsmith-templates');
var assets      = require('metalsmith-assets');

var assetsTask = assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
});

var markDownTask = markDown();

var templatesTask = templates({
    engine: 'handlebars'
});

// sets all file's metadata to have its file path set to `path`
var filePathTask = function(files, metalsmith, done){
    for(var file in files){
        files[file].path = file;
    }
    done();
};

var relativePathHelper = function(current, target) {
    // normalize and remove starting slash
    current = path.normalize(current).slice(0);
    target = path.normalize(target).slice(0);

    current = path.dirname(current);
    var out = path.relative(current, target);
    return out;
};

Handlebars.registerHelper('relative_path', relativePathHelper);

var metalsmith = metalsmith(__dirname)
    .clean(true)
    .use(markDownTask)
    .use(filePathTask)
    .use(templatesTask)
    .use(assetsTask)
    .build(function(err) {
        if (err) throw err;
    });
