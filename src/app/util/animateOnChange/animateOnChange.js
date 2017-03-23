app.directive('animateOnChange', ($animate, $timeout) => (scope, elem, attr) => {
  scope.$watch(attr.animateOnChange, (nv, ov) => {
    if (nv !== ov) {
      $animate.addClass(elem, 'change').then(() => {
        $timeout(() => $animate.removeClass(elem, 'change'));
      });
    }
  });
});
