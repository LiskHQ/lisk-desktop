
app.factory('error', ($mdDialog, $mdToast) => {
  return {
    toast ({ text }) {
      return $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('bottom right')
      )
    },
    dialog ({ title = 'Error', text, button = 'OK' }) {
      return $mdDialog.show(
        $mdDialog.alert()
          .title(title)
          .textContent(text)
          .ok(button)
      )
    }
  }
})
