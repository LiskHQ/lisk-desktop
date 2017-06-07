import './loadingBar.less';

app.component('loadingBar', {
  template: require('./loadingBar.pug')(),
  controller: class loadingBar {

    constructor($scope, $rootScope) {
      this.loaders = [];
      $rootScope.$on('showLoadingBar', (event, name) => {
        const index = this.loaders.indexOf(name);
        if (index === -1) {
          this.loaders.push(name);
        }
      });

      $rootScope.$on('hideLoadingBar', (event, name) => {
        const index = this.loaders.indexOf(name);
        if (index > -1) {
          this.loaders.splice(index, 1);
        }
      });
    }
  },
});

