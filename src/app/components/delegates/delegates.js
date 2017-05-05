import './delegates.less';

const UPDATE_INTERVAL = 10000;

app.component('delegates', {
  template: require('./delegates.pug')(),
  bindings: {
    account: '=',
    passphrase: '<',
  },
  controller: class delegates {
    constructor($scope, $rootScope, $peers, $mdDialog, $mdMedia,
      dialog, $timeout, delegateService, Account) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$peers = $peers;
      this.delegateService = delegateService;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;
      this.dialog = dialog;
      this.$timeout = $timeout;
      this.account = Account;

      this.$scope.search = '';
      this.voteList = [];
      this.votedDict = {};
      this.votedList = [];
      this.unvoteList = [];
      this.loading = true;
      this.usernameInput = '';
      this.usernameSeparator = '\n';

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
      if (this.$peers.active) {
        this.delegateService.listAccountDelegates({
          address: this.account.get().address,
        }).then((data) => {
          this.votedList = data.delegates || [];
          this.votedList.forEach((delegate) => {
            this.votedDict[delegate.username] = delegate;
          });
          this.loadDelegates(0, this.$scope.search);
        });
      }
    }

    loadDelegates(offset, search, replace) {
      this.loading = true;
      this.delegateService.listDelegates({
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

    addToUnvoteList(vote) {
      const delegate = this.delegates.filter(d => d.username === vote.username)[0] || vote;
      if (delegate.status.selected) {
        this.unvoteList.push(delegate);
      }
      delegate.status.selected = false;
    }

    setPendingVotes() {
      this.voteList.forEach((delegate) => {
        /* eslint-disable no-param-reassign */
        delegate.status.changed = false;
        delegate.status.voted = true;
        delegate.status.pending = true;
      });
      this.votePendingList = this.voteList.splice(0, this.voteList.length);

      this.unvoteList.forEach((delegate) => {
        delegate.status.changed = false;
        delegate.status.voted = false;
        delegate.status.pending = true;
        /* eslint-enable no-param-reassign */
      });
      this.unvotePendingList = this.unvoteList.splice(0, this.unvoteList.length);
      this.checkPendingVotes();
    }

    checkPendingVotes() {
      this.$timeout(() => {
        this.delegateService.listAccountDelegates(this.account.get().address,
        ).then((data) => {
          this.votedList = data.delegates || [];
          this.votedDict = {};
          (this.votedList).forEach((delegate) => {
            this.votedDict[delegate.username] = delegate;
          });
          this.votePendingList = this.votePendingList.filter((vote) => {
            if (this.votedDict[vote.username]) {
              // eslint-disable-next-line no-param-reassign
              vote.status.pending = false;
              return false;
            }
            return true;
          });
          this.unvotePendingList = this.unvotePendingList.filter((vote) => {
            if (!this.votedDict[vote.username]) {
              // eslint-disable-next-line no-param-reassign
              vote.status.pending = false;
              return false;
            }
            return true;
          });
          if (this.votePendingList.length + this.unvotePendingList.length > 0) {
            this.checkPendingVotes();
          }
        });
      }, UPDATE_INTERVAL);
    }

    parseVoteListFromInput() {
      this._parseListFromInput('voteList');
    }

    parseUnvoteListFromInput() {
      this._parseListFromInput('unvoteList');
    }

    _parseListFromInput(listName) {
      const list = this[listName];
      this.invalidUsernames = [];
      this.pendingRequests = 0;
      this.usernameList = this.usernameInput.trim().split(this.usernameSeparator);
      this.usernameList.forEach((username) => {
        if ((listName === 'voteList' && !this.votedDict[username.trim()]) ||
            (listName === 'unvoteList' && this.votedDict[username.trim()])) {
          this._setSelected(username.trim(), list);
        }
      });

      if (this.pendingRequests === 0) {
        this._selectFinish(true, list);
      }
    }

    _selectFinish(success, list) {
      if (list.length !== 0) {
        this.usernameListActive = false;
        this.usernameInput = '';
        this.openVoteDialog();
      } else {
        this.dialog.errorToast('No delegate usernames could be parsed from the input');
      }
    }

    _setSelected(username, list) {
      const delegate = this.delegates.filter(d => d.username === username)[0];
      if (delegate) {
        this._selectDelegate(delegate, list);
      } else {
        this.pendingRequests++;
        this.delegateService.getDelegate(username,
        ).then((data) => {
          this._selectDelegate(data.delegate, list);
        }).catch(() => {
          this.invalidUsernames.push(username);
        }).finally(() => {
          this.pendingRequests--;
          if (this.pendingRequests === 0) {
            this._selectFinish(this.invalidUsernames.length === 0, list);
          }
        });
      }
    }

    // eslint-disable-next-line class-methods-use-this
    _selectDelegate(delegate, list) {
      // eslint-disable-next-line no-param-reassign
      delegate.status = delegate.status || {};
      // eslint-disable-next-line no-param-reassign
      delegate.status.selected = true;
      if (list.indexOf(delegate) === -1) {
        list.push(delegate);
      }
    }

    openVoteDialog() {
      this.$mdDialog.show({
        controllerAs: '$ctrl',
        controller: class voteDialog {
          constructor($scope, voteList, unvoteList) {
            this.$scope = $scope;
            this.$scope.voteList = voteList;
            this.$scope.unvoteList = unvoteList;
          }
        },
        template:
          '<md-dialog flex="80">' +
            '<vote vote-list="voteList" unvote-list="unvoteList">' +
            '</vote>' +
          '</md-dialog>',
        fullscreen: (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.$scope.customFullscreen,
        locals: {
          voteList: this.voteList,
          unvoteList: this.unvoteList,
        },
      }).then((() => {
        this.setPendingVotes();
      }));
    }
  },
});

