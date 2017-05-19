import './vote.less';

/**
 * The vote dialog component
 *
 * @module app
 * @submodule vote
 */
app.component('vote', {
  template: require('./vote.pug')(),
  bindings: {
    voteList: '=',
    unvoteList: '=',
  },
  /**
   * The vote dialog component constructor class
   *
   * @class vote
   * @constructor
   */
  controller: class vote {
    constructor($scope, $mdDialog, dialog, delegateApi, $rootScope, Account) {
      this.$mdDialog = $mdDialog;
      this.dialog = dialog;
      this.delegateApi = delegateApi;
      this.$rootScope = $rootScope;
      this.account = Account;

      this.votedDict = {};
      this.votedList = [];

      this.getDelegates();
    }

    /**
     * Needs summary
     *
     * @method getDelegates
     */
    getDelegates() {
      this.delegateApi.listAccountDelegates({
        address: this.account.get().address,
      }).then((data) => {
        this.votedList = data.delegates || [];
        this.votedList.forEach((delegate) => {
          this.votedDict[delegate.username] = delegate;
        });
      });
    }

    /**
     * for an existing voteList and unvoteList it calls delegateApi.vote
     * to update vote list. Shows a toast on each state change.
     *
     * @method vote
     */
    vote() {
      this.votingInProgress = true;
      this.delegateApi.vote(
        this.account.get().passphrase,
        this.account.get().publicKey,
        this.voteList,
        this.unvoteList,
        this.secondPassphrase,
      ).then(() => {
        this.$mdDialog.hide(this.voteList, this.unvoteList);
        this.dialog.successToast('Voting successful');
      }).catch((response) => {
        this.dialog.errorToast(response.message || 'Voting failed');
      }).finally(() => {
        this.votingInProgress = false;
      });
    }

    /**
     * Checks for validity of votes list. used to enable/disable submit button.
     *
     * @method canVote
     * @returns {Boolean} Is the vote form valid?
     */
    canVote() {
      const totalVotes = this.voteList.length + this.unvoteList.length;
      return totalVotes > 0 && totalVotes <= 33 &&
              !this.votingInProgress &&
              (!this.account.get().secondSignature || this.secondPassphrase);
    }

    /**
     * Removes the delegate in the given index from votes list
     *
     * @method removeVote
     * @param {object[]} list the votes list
     * @param {Number} index the index of the delegate to be removed
     */
    // eslint-disable-next-line class-methods-use-this
    removeVote(list, index) {
      /* eslint-disable no-param-reassign */
      list[index].status.selected = list[index].status.voted;
      list[index].status.changed = false;
      /* eslint-enable no-param-reassign */
      list.splice(index, 1);
    }
  },
});

