import './vote.less';

app.component('vote', {
  template: require('./vote.pug')(),
  bindings: {
    voteList: '=',
    unvoteList: '=',
  },
  controller: class vote {
    constructor($scope, $mdDialog, dialog, delegateService, $rootScope, Account) {
      this.$mdDialog = $mdDialog;
      this.dialog = dialog;
      this.delegateService = delegateService;
      this.$rootScope = $rootScope;
      this.account = Account;

      this.votedDict = {};
      this.votedList = [];

      this.delegateService.listAccountDelegates({
        address: this.account.get().address,
      }).then((data) => {
        this.votedList = data.delegates || [];
        this.votedList.forEach((delegate) => {
          this.votedDict[delegate.username] = delegate;
        });
      });
    }

    vote() {
      this.votingInProgress = true;
      this.delegateService.vote({
        secret: this.account.get().passphrase,
        publicKey: this.account.get().publicKey,
        secondSecret: this.secondPassphrase,
        voteList: this.voteList,
        unvoteList: this.unvoteList,
      }).then(() => {
        this.$mdDialog.hide(this.voteList, this.unvoteList);
        this.dialog.successToast('Voting successful');
      }).catch((response) => {
        this.dialog.errorToast(response.message || 'Voting failed');
      }).finally(() => {
        this.votingInProgress = false;
      });
    }

    canVote() {
      const totalVotes = this.voteList.length + this.unvoteList.length;
      return totalVotes > 0 && totalVotes <= 33 &&
              !this.votingInProgress &&
              (!this.account.get().secondSignature || this.secondPassphrase);
    }

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

