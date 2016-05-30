
import gulp from 'gulp'
import connect from 'gulp-connect'

import { gulp as config } from '../config'

gulp.task('connect', () => {
  connect.server({
    root: config.build,
    livereload: true,
  })
})
