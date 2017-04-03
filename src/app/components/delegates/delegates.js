import './delegates.less';

app.component('delegates', {
  template: require('./delegates.pug')(),
  bindings: {
    account: '=',
  },
  controller: class delegates {
    constructor($scope, $peers) {
      this.$scope = $scope;
      this.$peers = $peers;

      this.filter = 'All';
      this.voteList = [];
      this.unvoteList = [];
      this.delegates = [];
      this.delegatesDisplayedCount = 20;
      this.$scope.states = ['All', 'Active', 'Stand by', 'Voted', 'Not Voted', 'Selected'];

      this.$peers.active.listActiveDelegates(101, this.addDelegates.bind(this));
      this.$peers.active.listStandyDelegates(101, this.addDelegates.bind(this));
    }

    addDelegates(data) {
      this.delegates = this.delegates.concat(data.delegates.map((delegate) => {
        const voted = Math.random() > 0.5;
        delegate.status = {  // eslint-disable-line no-param-reassign
          All: true,
          Voted: voted,
          'Not Voted': !voted,
          Active: delegate.rate <= 101,
          'Stand By': delegate.rate > 101,
        };
        return delegate;
      }));
    }

    showMore() {
      this.delegatesDisplayedCount += 20;
    }

    selectionChange(delegate) {
      const list = delegate.status.Voted ? this.unvoteList : this.voteList;
      if (delegate.status.Selected) {
        list.push(delegate);
      } else {
        list.splice(list.indexOf(delegate), 1);
      }
    }

    activateSearch() {
      this.searchActive = true;
    }
  },
});

