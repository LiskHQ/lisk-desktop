import './vote.less';

/**
 * The votes tab component
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
   * The vote tab component constructor class
   *
   * @class vote
   * @constructor
   */
  controller: class vote {
    constructor($scope, $mdDialog, dialog, delegateService, $rootScope, Account) {
      this.$mdDialog = $mdDialog;
      this.dialog = dialog;
      this.delegateService = delegateService;
      this.$rootScope = $rootScope;
      this.account = Account;

      this.votedDict = {};
      this.votedList = [];

      this.getDelegates();
    }

    /**
     * Needs summery
     * 
     * @method getDelegates
     */
    getDelegates() {
      this.delegateService.listAccountDelegates({
        address: this.account.get().address,
      }).then((data) => {
        this.votedList = data.delegates || [];
        this.votedList.forEach((delegate) => {
          this.votedDict[delegate.username] = delegate;
        });
      });
    }

    /**
     * for an existing voteList and unvoteList it calls delegateService.vote
     * to update vote list. Shows a toast on each state change.
     * 
     * @method vote
     */
    vote() {
      this.votingInProgress = true;
      this.delegateService.vote(
        this.account.get().passphrase,
        this.account.get().publicKey,
        this.secondPassphrase,
        this.voteList,
        this.unvoteList
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
     * Checks if valiity of votes list. used to enable/disable sibmit button.
     * 
     * @method canVote
     * @returns {boolean} Is the vote form valid?
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

