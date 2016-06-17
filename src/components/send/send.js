
import './send.less'

import app from '../../app'

const ADDRESS_VALID_RE = '^[0-9]{1,21}[L|l]$'
const AMOUNT_VALID_RE = '^[0-9]+(\.[0-9]{1,8})?$'

app.directive('send', (error, success) => {
  return {
    restrict: 'E',
    template: require('./send.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      $scope.send = {
        reset () {
          $scope.send.recipient.value = ''
          $scope.send.amount.value = ''
        },
        go () {
          $scope.send.loading = true

          $scope.peer.sendTransaction(
            $scope.passphrase,
            $scope.secondPassphrase,
            $scope.send.recipient.value,
            $scope.send.amount.value
          )
          .then(
            (res) => {
              return success.dialog({ text: `${$scope.send.amount.value} sent to ${$scope.send.recipient.value}` })
                .then(() => {
                  $scope.send.reset()
                  $scope.updateBalance()
                  $scope.updateTransactions()
                })
            },
            (res) => {
              error.dialog({ text: res && res.message ? res.message : 'An error occurred while sending the transaction.' })
            }
          )
          .finally(() => {
            $scope.send.loading = false
          })
        },
        recipient: {
          regexp: ADDRESS_VALID_RE,
        },
        amount: {
          regexp: AMOUNT_VALID_RE,
        }
      }
    }
  }
})
