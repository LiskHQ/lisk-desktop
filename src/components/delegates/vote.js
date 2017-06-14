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
    constructor($scope, $mdDialog, dialog, delegateApi, $rootScope, Account, lsk) {
      this.$mdDialog = $mdDialog;
      this.dialog = dialog;
      this.delegateApi = delegateApi;
      this.$rootScope = $rootScope;
      this.account = Account;
      this.lsk = lsk;

      this.votedDict = {};
      this.votedList = [];

      this.getDelegates();
      this.fee = 1;
    }

    /**
     * Needs summary
     *
     * @method getDelegates
     */
    getDelegates() {
      this.delegateApi.listAccountDelegates(this.account.get().address,
      ).then((data) => {
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
        this.dialog.successAlert({
          text: 'Your votes were successfully submitted. It can take several seconds before they are processed.',
        });
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
              (!this.account.get().secondSignature || this.secondPassphrase) &&
              this.lsk.normalize(this.account.get().balance) > this.fee;
    }
  },
});

