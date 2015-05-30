var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var _ = require('lodash');
var browserify = require('browserify');
var es6ify = require('es6ify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var glob = require('glob');
var livereload = require('gulp-livereload');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var packageFile = require('./package.json');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
  'react/addons',
  'flux-react'
];

var browserifyTask = function (options) {

  // Our app bundler
	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
   	transform: [reactify, es6ify], // We want to convert JSX to normal javascript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// We set our dependencies as externals on our app bundler when developing.
  // You might consider doing this for production also and load two javascript
  // files (main.js and vendors.js), as vendors.js will probably not change and
  // takes full advantage of caching
	appBundler.external(options.development ? dependencies : []);


  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }
      
  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included 
  // in the application bundle
  if (options.development) {

  	var testFiles = glob.sync('./specs/**/*-spec.js');
		var testBundler = browserify({
			entries: testFiles,
			debug: true, // Gives us sourcemapping
			transform: [reactify],
			cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
		});

    testBundler.external(dependencies);

  	var rebundleTests = function () {
  		var start = Date.now();
  		console.log('Building TEST bundle');
  		testBundler.bundle()
      .on('error', gutil.log)
	      .pipe(source('specs.js'))
	      .pipe(gulp.dest(options.dest))
	      .pipe(notify(function () {
	        console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
	      }));
  	};

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

    // Remove react-addons when deploying, as it is only for
    // testing
    if (!options.development) {
      dependencies.splice(dependencies.indexOf('react-addons'), 1);
    }

    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });
    
    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));
    
  }
  
}

var cssTask = function (options) {
    if (options.development) {
      var run = function () {
        console.log(options);
        var start = new Date();
        console.log('Building CSS bundle');
        gulp.src(options.src)
          .pipe(less())
          .pipe(concat('main.css'))
          .pipe(gulp.dest(options.dest))
          .pipe(notify(function () {
            console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
          }));
      };
      run();
      gulp.watch(options.src, run);
    } else {
      gulp.src(options.src)
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(options.dest));
    }
};

var assetsTask = function (options) {
  gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
};

// Starts our development workflow
gulp.task('default', function () {

  browserifyTask({
    development: true,
    src: './app/main.js',
    dest: './build'
  });
  
  cssTask({
    development: true,
    src: ['./app/**/*.less'].concat(packageFile.vendorStyles),
    dest: './build/css'
  });

  _.each(packageFile.vendorAssets, function (asset) {

    assetsTask({
      development: true,
      src: asset.files,
      dest: './build' + asset.dest
    });

  });

  assetsTask({
    development: true,
    src: './app/assets/*',
    dest: './build/assets'
  })

});

gulp.task('prod', function () {

  browserifyTask({
    development: false,
    src: './app/main.js',
    dest: './dist'
  });
  
  cssTask({
    development: false,
    src: ['./app/**/*.less'].concat(packageFile.vendorStyles),
    dest: './dist/css'
  });


  _.each(packageFile.vendorAssets, function (asset) {

    assetsTask({
      development: false,
      src: asset.files,
      dest: './dist' + asset.dest
    });


    assetsTask({
      development: false,
      src: './app/assets/*',
      dest: './dist/assets'
    })

  });

});

gulp.task('test', function () {
    return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});

gulp.task('serve', ['default'], function () {
  nodemon({
    script: 'app.js'
    , ext: 'js jade'
    , env: { 'nodemon_start': true}
  }).on('restart', function () {
    livereload();
  });
});