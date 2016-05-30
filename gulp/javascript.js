
import gulp from 'gulp'
import connect from 'gulp-connect'
import jspm from 'gulp-jspm'
import rename from 'gulp-rename'

import { gulp as config } from '../config'

gulp.task('js:build', () => {
  gulp
    .src(config.js.src)
    .pipe(jspm({ selfExecutingBundle: true }))
    .pipe(rename(config.js.out))
    .pipe(gulp.dest(config.build))
    .pipe(connect.reload())
})
