var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var open = require('gulp-open');

var Paths = {
  HERE: './',
  DIST: 'dist/',
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**'
};

gulp.task('compile-scss', function() {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)

    .pipe(rename({
      prefix: '',
      basename: 'material-kit',
      suffix: ''
    }))

    .pipe(sourcemaps.init())

		.pipe(sass({
			outputStyle: 'expanded',
			precision: 6,
			errLogToConsole: true
    }).on('error', sass.logError))

    .pipe(autoprefixer({browsers: [
      '>= 0.01%',
      'last 4 versions',
      'Edge >= 12',
      'ie_mob >= 10',
      'Android 2.3',
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24',
      'Explorer >= 8',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]}))
  
    .pipe(sourcemaps.write(Paths.HERE))
  
    .pipe(gulp.dest(Paths.CSS));
  
});

gulp.task('minify-scss', function() {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)

    .pipe(rename({
      prefix: '',
      basename: 'material-kit',
      suffix: ''
    }))

    .pipe(sass({
      outputStyle: 'compressed',
      precision: 6,
      errLogToConsole: true
    }).on('error', sass.logError))

    .pipe(autoprefixer({browsers: [
      '>= 0.01%',
      'last 4 versions',
      'Edge >= 12',
      'ie_mob >= 10',
      'Android 2.3',
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24',
      'Explorer >= 8',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]}))

    .pipe(rename({
      suffix: '.min'
    }))

    .pipe(gulp.dest(Paths.CSS));

});


gulp.task('watch', function() {
  gulp.watch(Paths.SCSS, gulp.series('compile-scss', 'minify-scss'));
});

gulp.task('open', function() {
  gulp.src('index.html')
    .pipe(open());
});

gulp.task('open-app', gulp.parallel('open', 'watch'));
