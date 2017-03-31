import './forging.less';

app.component('forging', {
  template: require('./forging.pug')(),
  bindings: {
    account: '=',
  },
  controller: class forging {
    constructor($scope, $location) {
      this.$scope = $scope;
      this.$scope.delegate = $location.search().noforging ? { } : {
        username: 'slaweet',
        time: 26829751,
        rank: 77,
      };
      if (!$location.search().noblocks) {
        this.$scope.statistics = {
          today: 200000,
          last24h: 2000000,
          last7d: 20000000,
          last30d: 200000000,
        };
        this.$scope.totalForged = 43200000000;
        this.$scope.rank = 77;
        this.$scope.productivity = 20;
        this.$scope.approval = 80;
        this.$scope.showAllColumns = false;
      } else {
        this.$scope.rank = 377;
        this.$scope.productivity = 0;
        this.$scope.approval = 0;
        this.$scope.showAllColumns = false;
      }
      this.$scope.blocks = $location.search().noblocks ? [] : [{
        id: '3881345055239321586',
        timestamp: 26836720,
        height: 7933,
        totalFee: 0,
        reward: 0,
        generatorId: '15441829200899900957L',
        confirmations: 1,
        totalForged: '0',
      }, {
        id: '13266308849752923233',
        version: 0,
        timestamp: 26836710,
        height: 7932,
        numberOfTransactions: 0,
        totalAmount: 0,
        totalFee: 0,
        reward: 0,
        payloadLength: 0,
        generatorId: '2003981962043442425L',
        confirmations: 2,
        totalForged: '0',
      }, {
        id: '16048816357878795927',
        version: 0,
        timestamp: 26836700,
        height: 7931,
        numberOfTransactions: 0,
        totalAmount: 0,
        totalFee: 0,
        reward: 0,
        payloadLength: 0,
        generatorId: '6253486079725348800L',
        confirmations: 3,
        totalForged: '0',
      }];

      this.loaded = true;
    }
  },
});

