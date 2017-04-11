import './delegates.less';
import './vote.less';

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

      this.$scope.filter = 'All';
      this.$scope.search = '';
      this.voteList = [];
      this.votedList = [];
      this.unvoteList = [];
      this.delegates = [];
      this.delegatesDisplayedCount = 20;
      this.$scope.states = ['All', 'Active', 'Stand by', 'Voted', 'Not Voted', 'Changed'];

      this.$peers.active.sendRequest('accounts/delegates', { address: this.account.address }, (data) => {
        this.votedList = data.delegates || [];
        this.loadDelegates(0, this.$scope.search, () => {
          this.loadDelegates(100, this.$scope.search);
        });
      });

      this.$scope.$watch('search', () => {
        this.delegatesDisplayedCount = 20;
        if (this.$scope.search.length > 2 || this.$scope.search.length === 0) {
          this.loadDelegates(0, this.$scope.search, () => {
            this.delegates = [];
          });
        }
      });

      this.$scope.$watch('filter', () => {
        this.delegatesDisplayedCount = 20;
      });
    }

    loadDelegates(offset, search, callback) {
      this.loading = true;
      this.$peers.active.sendRequest(`delegates/${search ? 'search' : ''}`, {
        offset,
        limit: '100',
        q: search,
      }, ((data) => {
        callback(data);
        this.addDelegates(data);
      }));
      this.lastSearch = search;
    }

    addDelegates(data) {
      if (data.success) {
        this.delegates = this.delegates.concat(data.delegates.map((delegate) => {
          const voted = this.votedList.filter(
            vote => vote.address === delegate.address).length === 1;
          const active = delegate.rate <= 101;
          delegate.status = {  // eslint-disable-line no-param-reassign
            All: true,
            Selected: voted,
            Voted: voted,
            'Not Voted': !voted,
            Active: active,
            'Stand By': !active,
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
      delegate.status.Changed = delegate.status.Voted !== delegate.status.Selected;
      const list = delegate.status.Voted ? this.unvoteList : this.voteList;
      if (delegate.status.Changed) {
        list.push(delegate);
      } else {
        list.splice(list.indexOf(delegate), 1);
      }
    }

    confirmVote() {
      this.$mdDialog.show({
        controllerAs: '$ctrl',
        controller: /* @ngInject*/ class save {
          constructor($scope, $mdDialog, $mdToast, $peers,
            account, passphrase, voteList, unvoteList) {
            this.$mdDialog = $mdDialog;
            this.$mdToast = $mdToast;
            this.$peers = $peers;
            this.account = account;
            this.passphrase = passphrase;
            this.voteList = voteList || [];
            this.unvoteList = unvoteList || [];
          }

          // eslint-disable-next-line class-methods-use-this
          removeVote(list, index) {
            /* eslint-disable no-param-reassign */
            list[index].status.Selected = list[index].status.Voted;
            list[index].status.Changed = false;
            /* eslint-enable no-param-reassign */
            list.splice(index, 1);
          }

          canVote() {
            const totalVotes = this.voteList.length + this.unvoteList.length;
            return totalVotes > 0 && totalVotes <= 33 && !this.votingInProgress;
          }

          vote() {
            this.votingInProgress = true;
            this.$peers.active.sendRequest('accounts/delegates', {
              secret: this.passphrase,
              publicKey: this.account.publicKey,
              secondSecret: this.account.secondSecret,
              delegates: this.voteList.map(delegate => `+${delegate.publicKey}`).concat(
                  this.unvoteList.map(delegate => `-${delegate.publicKey}`)),
            },
              (response) => {
                const toast = this.$mdToast.simple();
                if (response.success) {
                  this.clearVotes();
                  this.$mdDialog.hide();
                  toast.toastClass('lsk-toast-success');
                  toast.textContent('Voting succesfull');
                } else {
                  toast.toastClass('lsk-toast-error');
                  toast.textContent(response.message || 'Voting failed');
                }
                this.$mdToast.show(toast);
                this.votingInProgress = false;
              });
          }

          clearVotes() {
            this.voteList.forEach((delegate) => {
              /* eslint-disable no-param-reassign */
              delegate.status.Changed = false;
              delegate.status.Voted = true;
              delegate.status['Not Voted'] = false;
            });
            this.voteList.splice(0, this.voteList.length);

            this.unvoteList.forEach((delegate) => {
              delegate.status.Changed = false;
              delegate.status.Voted = false;
              delegate.status['Not Voted'] = true;
              /* eslint-enable no-param-reassign */
            });
            this.unvoteList.splice(0, this.voteList.length);
          }

          close() {
            this.$mdDialog.hide();
          }
        },

        template: require('./vote.pug')(),
        fullscreen: (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.$scope.customFullscreen,
        locals: {
          account: this.account,
          passphrase: this.passphrase,
          voteList: this.voteList,
          unvoteList: this.unvoteList,
        },

      });
    }

    activateSearch() {
      this.delegatesDisplayedCount = 20;
      this.searchActive = true;
    }
  },
});

