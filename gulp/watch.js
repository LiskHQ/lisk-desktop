
import gulp from 'gulp'
import path from 'path'
import util from 'gulp-util'

import { gulp as config } from '../config'

gulp.task('watch', () => {
  let log = e => {
    util.log(util.colors.green(`File ${e.type}: `) + util.colors.magenta(path.basename(e.path)))
  }

  gulp.watch([config.pug], ['pug:build']).on('change', log)
  gulp.watch([config.less.src], ['less:build']).on('change', log)
  gulp.watch([config.js.watch], ['js:build']).on('change', log)
})
