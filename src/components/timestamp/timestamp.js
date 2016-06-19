
import './timestamp.less'

import moment from 'moment'

import app from '../../app'

app.directive('timestamp', () => {
  return {
    restrict: 'C',
    template: require('./timestamp.jade'),
    scope: { data: '=' },
    link (scope, elem, attrs) {},
    controller: ($scope, $timeout, timestampFilter) => {
      let timeout

      let update = () => {
        $timeout.cancel(timeout)

        let obj = moment(timestampFilter($scope.data))
        $scope.full = obj.toISOString()
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
