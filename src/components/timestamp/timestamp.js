
import './timestamp.less'

import moment from 'moment'

import app from '../../app'

app.directive('timestamp', () => {
  return {
    restrict: 'C',
    template: require('./timestamp.jade'),
    scope: { data: '=' },
    link (scope, elem, attrs) {},
    controller: ($scope, $timeout) => {
      let fixLiskTimestamp = (value) => {
        return new Date((((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + value) * 1000))
      }

      let timeout

      let update = () => {
        $timeout.cancel(timeout)

        let obj = moment(fixLiskTimestamp($scope.data))
        $scope.full = obj.format('llll')
        $scope.time_ago = obj.fromNow()

        timeout = $timeout(update, 60000)
      }

      $scope.$watch('data', () => {
        update()
      })

      $scope.$on('$destroy', () => {
        $timeout.cancel(timeout)
      })
    }
  }
})
