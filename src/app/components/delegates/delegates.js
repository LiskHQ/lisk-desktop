import './delegates.less';

app.component('delegates', {
  template: require('./delegates.pug')(),
  bindings: {
    account: '=',
    passphrase: '<',
  },
  controller: class delegates {
    constructor($scope, $peers, $mdDialog, $mdMedia) {
      this.$scope = $scope;
      this.$peers = $peers;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;

      this.$scope.search = '';
      this.voteList = [];
      this.votedDict = {};
      this.votedList = [];
      this.unvoteList = [];

      this.updateAll();

      this.$scope.$watch('search', (search, oldValue) => {
        this.delegatesDisplayedCount = 20;
        if (search || oldValue) {
          this.loadDelegates(0, search, true);
        }
      });

      this.$scope.$on('peerUpdate', () => {
        this.updateAll();
      });
    }

    updateAll() {
      this.delegates = [];
      this.delegatesDisplayedCount = 20;
      this.$peers.sendRequestPromise('accounts/delegates', {
        address: this.account.address,
      }).then((data) => {
        this.votedList = data.delegates || [];
        (this.votedList).forEach((delegate) => {
          this.votedDict[delegate.username] = delegate;
        });
        this.loadDelegates(0, this.$scope.search);
      });
    }

    loadDelegates(offset, search, replace) {
      this.loading = true;
      this.$peers.sendRequestPromise(`delegates/${search ? 'search' : ''}`, {
        offset,
        limit: '100',
        q: search,
      }).then((data) => {
        this.addDelegates(data, replace);
      });
      this.lastSearch = search;
    }

    addDelegates(data, replace) {
      if (data.success) {
        if (replace) {
          this.delegates = [];
        }
        this.delegates = this.delegates.concat(data.delegates.map((delegate) => {
          const voted = this.votedDict[delegate.username] !== undefined;
          const changed = this.voteList.concat(this.unvoteList)
            .map(d => d.username).indexOf(delegate.username) !== -1;
          delegate.status = {  // eslint-disable-line no-param-reassign
            selected: (voted && !changed) || (!voted && changed),
            voted,
            changed,
          };
          return delegate;
        }));
        this.delegatesTotalCount = data.totalCount;
        this.loading = false;
      }
    }

    showMore() {
      if (this.delegatesDisplayedCount < this.delegates.length) {
        this.delegatesDisplayedCount += 20;
      }
      if (this.delegates.length - this.delegatesDisplayedCount <= 20 &&
          this.delegates.length < this.delegatesTotalCount &&
          !this.loading) {
        this.loadDelegates(this.delegates.length, this.$scope.search);
      }
    }

    selectionChange(delegate) {
      // eslint-disable-next-line no-param-reassign
      delegate.status.changed = delegate.status.voted !== delegate.status.selected;
      const list = delegate.status.voted ? this.unvoteList : this.voteList;
      if (delegate.status.changed) {
        list.push(delegate);
      } else {
        list.splice(list.indexOf(delegate), 1);
      }
    }

    clearSearch() {
      this.$scope.search = '';
    }

    openVoteDialog() {
      this.$mdDialog.show({
        controllerAs: '$ctrl',
        controller: class voteDialog {
          constructor($scope, account, passphrase, voteList, unvoteList) {
            this.$scope = $scope;
            this.$scope.account = account;
            this.$scope.passphrase = passphrase;
            this.$scope.voteList = voteList;
            this.$scope.unvoteList = unvoteList;
          }
        },
        template:
          '<md-dialog>' +
            '<vote account="account" passphrase="passphrase" ' +
              'vote-list="voteList" unvote-list="unvoteList">' +
            '</vote>' +
          '</md-dialog>',
        fullscreen: (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.$scope.customFullscreen,
        locals: {
          account: this.account,
          passphrase: this.passphrase,
          voteList: this.voteList,
          unvoteList: this.unvoteList,
        },

      });
    }
  },
});

