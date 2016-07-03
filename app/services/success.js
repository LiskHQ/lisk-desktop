
app.factory('success', ($mdDialog, $mdToast) => {
  return {
    toast ({ text }) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('bottom right')
      )
    },
    dialog ({ title = 'Success', text, button = 'OK' }) {
      return $mdDialog.show(
        $mdDialog.alert()
          .title(title)
          .textContent(text)
          .ok(button)
      )
    }
  }
})
