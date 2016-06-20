
import './send.less'

import app from '../../app'

const ADDRESS_VALID_RE = '^[0-9]{1,21}[L|l]$'
const AMOUNT_VALID_RE = '^[0-9]+(\.[0-9]{1,8})?$'

app.directive('send', (error, success) => {
  return {
    restrict: 'E',
    template: require('./send.jade'),
    scope: { account: '=', peer: '=', passphrase: '=' },
    controller: ($scope) => {
      $scope.recipient = {
        regexp: ADDRESS_VALID_RE,
      }

      $scope.amount = {
        regexp: AMOUNT_VALID_RE,
      }

      $scope.reset = () => {
        $scope.recipient.value = ''
        $scope.amount.value = ''
      }

      $scope.go = () => {
        $scope.loading = true

        $scope.peer.sendTransaction(
          $scope.passphrase,
          $scope.secondPassphrase,
          $scope.recipient.value,
          $scope.amount.value
        )
        .then(
          (res) => {
            return success.dialog({ text: `${$scope.amount.value} sent to ${$scope.recipient.value}` })
              .then(() => {
                $scope.reset()
                $scope.updateBalance()
                $scope.updateTransactions()
              })
          },
          (res) => {
            error.dialog({ text: res && res.message ? res.message : 'An error occurred while sending the transaction.' })
          }
        )
        .finally(() => {
          $scope.loading = false
        })
      }
    }
  }
})
