
import app from '../app'

app.controller('main', ($scope, login) => {
  login.start($scope)
})
