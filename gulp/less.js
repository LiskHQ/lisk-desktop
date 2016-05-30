
import gulp from 'gulp'
import connect from 'gulp-connect'
import less from 'gulp-less'
import concat from 'gulp-concat'
import order from 'gulp-order'

import { gulp as config } from '../config'

gulp.task('less:build', () => {
  gulp
    .src(config.less.src)
    .pipe(order(['index.less']))
    .pipe(concat(config.less.out))
    .pipe(less())
    .pipe(gulp.dest(config.build))
    .pipe(connect.reload())
})
