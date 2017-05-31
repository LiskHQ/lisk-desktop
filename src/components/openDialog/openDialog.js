/**
 * a directive to use dialog.modal as a directive
 */
app.directive('openDialog', (dialog) => {
  const linkFunc = ($scope, $element) => {
    $element.bind('click', () => {
      dialog.modal($scope.openDialog, $scope.options);
    });
  };
  return {
    scope: {
      options: '=',
      openDialog: '@',
    },
    link: linkFunc,
  };
});
