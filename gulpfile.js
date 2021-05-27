const gulp = require('gulp'); // Подключаем Gulp
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');

const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');


gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
	gulp.watch("./build/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
	return gulp.src('./src/sass/**/*.+(scss|sass|css)')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass({outputStyle: 'compressed'}).on('error', sass.logError)) 
		.pipe(rename({suffix: '.min', prefix: ''}))
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./build/css/') )
		.pipe( browserSync.stream() )
});

gulp.task('html', function () {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./build/"))
});

gulp.task('watch', function() {
	gulp.watch( ['./build/js/**/*.*', './build/img/**/*.*'], gulp.parallel(browserSync.reload) );

    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
	gulp.watch("src/css/**/*.*").on('all', gulp.parallel('copy:css'));
    gulp.watch("src/js/**/*.*").on('change', gulp.parallel('copy:js'));
    gulp.watch("src/img/**/*.*").on('all', gulp.parallel('copy:img'));
	gulp.watch("src/fonts/**/*.*").on('all', gulp.parallel('copy:fonts'));
});

gulp.task('copy:img', function() {
	return gulp.src('./src/img/**/*.*')
	  .pipe(imagemin())
	  .pipe(gulp.dest('./build/img/'))
});

gulp.task('copy:js', function() {
	return gulp.src('./src/js/**/*.*')
	  .pipe(gulp.dest('./build/js/'))
});

gulp.task('copy:css', function() {
	return gulp.src('./src/css/**/*.*')
	  .pipe(gulp.dest('./build/css/'))
});

gulp.task('copy:fonts', function() {
	return gulp.src('./src/fonts/**/*.*')
	  .pipe(gulp.dest('./build/fonts/'))
});



gulp.task('clean:build', function() {
	return del('./build')
});

gulp.task(
		'default', 
		gulp.series( 
			gulp.parallel('clean:build'),
			gulp.parallel('styles', 'html', 'copy:css', 'copy:img', 'copy:js', 'copy:fonts',), 
			gulp.parallel('server', 'watch'), 
			)
	);
