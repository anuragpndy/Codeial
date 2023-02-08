const gulp=require('gulp');
const cssnano=require('gulp-cssnano');
const rev=require('gulp-rev');
const uglify=require('gulp-uglify-es').default;
const imagemin=require('gulp-imagemin');
const del=require('del');

gulp.task('css', function(done){
    console.log('minifying css...');
     gulp.src('./assets/**/*.css')      //** means any folder or subfolder, * means any file
	.pipe(cssnano())                    //pine is like middleware, which is passing these fns thrugh gulp
    .pipe(rev())                        //reversioning of file
    .pipe(gulp.dest('./public/assets')) //for production mode we store all assets in public folder containing assets
    .pipe(rev.manifest({                //store a manifest
        cwd: 'public',
        merge: true                     //if file already exist then merge the content of manifest
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js',function(done){
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())                     //minimize the js
    .pipe(rev())
    .pipe(gulp.dest('./public/assets')) 
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg|webp)')   //regular expression
    .pipe(imagemin())                                        //minimize the image
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

//empty the public asset directory (whenever we need to build the project, we should clear previuos build & build from scratch)
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');            //del is used to remove previous builds
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js','images'), function(done){
    console.log('Building assets');
    done();
});