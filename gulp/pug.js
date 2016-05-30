
import gulp from 'gulp'
import connect from 'gulp-connect'
import pug from 'gulp-pug'

import config from '../config'

gulp.task('pug:build', () => {
  gulp
    .src(config.gulp.pug)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(config.gulp.build))
    .pipe(connect.reload())
})
