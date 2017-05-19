import './delegates.less';

const UPDATE_INTERVAL = 10000;

/**
 * The delegates tab component
 *
 * @module app
 * @submodule delegates
 */
app.component('delegates', {
  template: require('./delegates.pug')(),
  bindings: {
    account: '=',
    passphrase: '<',
  },
  /**
   * The delegates tab component constructor class
   *
   * @class delegates
   * @constructor
   */
  controller: class delegates {
    constructor($scope, $rootScope, Peers, $mdDialog, $mdMedia,
      dialog, $timeout, delegateApi, Account) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.peers = Peers;
      this.delegateApi = delegateApi;
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

    /**
     * Updates the lists of delegates and voted delegates
     *
     * @method updateAll
     */
    updateAll() {
      this.delegates = [];
      this.delegatesDisplayedCount = 20;
      if (this.peers.active) {
        this.delegateApi.listAccountDelegates({
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

    /**
     * Fetches a list of delegates based on the given search phrase
     *
     * @method loadDelegates
     * @param {Number} offset - The starting index of for the results
     * @param {String} search - The search phrase to match with the delegate name
     * @param {Boolean} replace - Passed to addDelegates, defines if the results
     *  should replace the old delegates list
     * @param {Number} limit - The maximum number of results
     */
    loadDelegates(offset, search, replace, limit = 100) {
      this.loading = true;
      this.delegateApi.listDelegates({
        offset,
        limit: limit.toString(),
        q: search,
      }).then((data) => {
        this.addDelegates(data, replace);
      });
      this.lastSearch = search;
    }

    /**
     * Fills the list of delegates, sets their voted and changed status
     *
     * @method addDelegates
     * @param {Object} data - The result of delegateApi.listDelegates Api call
     * @param {Boolean} replace - defines if the results should replace
     *  the old delegates list
     */
    addDelegates(data, replace) {
      if (data.success) {
        if (replace) {
          this.delegates = data.delegates;
        } else {
          this.delegates = this.delegates.concat(data.delegates);
        }

        data.delegates.forEach((delegate) => {
          const voted = this.votedDict[delegate.username] !== undefined;
          const changed = this.voteList.concat(this.unvoteList)
            .map(d => d.username).indexOf(delegate.username) !== -1;
          delegate.status = {  // eslint-disable-line no-param-reassign
            selected: (voted && !changed) || (!voted && changed),
            voted,
            changed,
          };
        });

        this.delegatesTotalCount = data.totalCount;
        this.loading = false;
      }
    }

    /**
     * Needs summary
     *
     * @method showMore
     */
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

    /**
     * Needs summary
     *
     * @method selectionChange
     * @param {any} delegate
     */
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

    /**
     * Needs summary
     *
     * @method clearSearch
     */
    clearSearch() {
      this.$scope.search = '';
    }

    /**
     * Adds delegates to vote delegates list
     *
     * @method addToUnvoteList
     * @param {Object} vote - The delegate to add to voted delegates list
     */
    addToUnvoteList(vote) {
      const delegate = this.delegates.filter(d => d.username === vote.username)[0] || vote;
      if (delegate.status.selected) {
        this.unvoteList.push(delegate);
      }
      delegate.status.selected = false;
    }

    /**
     * Needs summary
     *
     * @method setPendingVotes
     */
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

    /**
     * Fetches the list of delegates we've voted for (voted delegates),
     * and updates the list and removes the confirmed votes from votePendingList
     *
     * @method checkPendingVotes
     * @todo Use Sync service and remove recursive timeout
     */
    checkPendingVotes() {
      this.$timeout(() => {
        this.delegateApi.listAccountDelegates(this.account.get().address,
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

    /**
     * Needs summary
     *
     * @method parseVoteListFromInput
     */
    parseVoteListFromInput() {
      this._parseListFromInput('voteList');
    }

    /**
     * Needs summary
     *
     * @method parseUnvoteListFromInput
     */
    parseUnvoteListFromInput() {
      this._parseListFromInput('unvoteList');
    }

    /**
     * @private
     */
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

    /**
     * @private
     */
    _selectFinish(success, list) {
      if (list.length !== 0) {
        this.usernameListActive = false;
        this.usernameInput = '';
        this.openVoteDialog();
      } else {
        this.dialog.errorToast('No delegate usernames could be parsed from the input');
      }
    }

    /**
     * @private
     */
    _setSelected(username, list) {
      const delegate = this.delegates.filter(d => d.username === username)[0];
      if (delegate) {
        this._selectDelegate(delegate, list);
      } else {
        this.pendingRequests++;
        this.delegateApi.getDelegate(username,
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

    /**
     * Uses mdDialog to show vote list directive.
     *
     * @method openVoteDialog
     * @todo Use a general dialog service instead.
     */
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

